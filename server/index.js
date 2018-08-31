const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { ApolloError } = require('apollo-server');
const { apolloUploadExpress } = require('apollo-upload-server');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');
const createGraphQLSchema = require('./graphql');
const set = require('lodash.set');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { AuthService } = require('./graphql/types/auth/AuthService');
const { PhotoService } = require('./graphql/types/photo/PhotoService');
const { UserService } = require('./graphql/types/user/UserService');
const { JwtBlacklistService } = require('./graphql/types/auth/JwtBlacklistService');

const { Repository } = require('./database/Repository');

const DEFAULT_PORT = 3001;
const DEFAULT_SECRET = 'totally-unguessable-jwt-secret';

const createRepositories = () => {
    const userRepository = new Repository('user');
    const photoRepository = new Repository('photo');

    return {
        userRepository,
        photoRepository,
    }
}

const createServices = (user, repos, secret, jwtBlacklistService) => { 
    const userService = new UserService(repos.userRepository);
    const photoService = new PhotoService(repos.photoRepository, user);
    const authService = new AuthService(userService, jwtBlacklistService, secret);
    
    return { 
        userService, 
        photoService, 
        authService, 
    }
}

const isRevokedCallback = async (req, payload, done) => {
    const isRevoked = jwtBlacklistService.isRevoked(payload);
    done(null, isRevoked);
}

const addDecodedTokenToRequest = () => (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        next();
        return;
    }
    const parts = req.headers.authorization.split(' ');
    if (parts.length != 2) {
        next();
        return;
    }
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme)) {
        next();
        return;
    }
    const dtoken = jwt.decode(token);
    set(req, 'token', dtoken);
    next();
}

const createGraphqlServer = async ({ schema, secret = DEFAULT_SECRET }) => {
    const app = express();
    const repos = createRepositories();
    const jwtBlacklistService = new JwtBlacklistService();

    app.use(
        '/graphql',
        cors(),
        jwtExpress({ 
            secret, 
            credentialsRequired: false,
            isRevoked: isRevokedCallback
        }),
        addDecodedTokenToRequest(),
        bodyParser.json(),
        apolloUploadExpress(),
        graphqlExpress(({ user, token }) => ({ 
            schema, 
            context: { 
                user,
                ...{token},
                ...createServices(user, repos, secret, jwtBlacklistService) 
            } 
        })),
    );
    app.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql',
            subscriptionsEndpoint: `ws://localhost:${DEFAULT_PORT}/subscriptions`,
        }),
    );
    return app;
};

const launchServer = async ({ port = DEFAULT_PORT, secret }) => {
    const schema = await createGraphQLSchema();
    const server = await createGraphqlServer({ schema, secret });
    const ws = createServer(server);
    return new Promise((resolve, reject) =>
        ws.listen(port, err => (err ? reject(err) : resolve({ port, server })))).then(() => {
            new SubscriptionServer({
                execute,
                subscribe,
                schema,
                onConnect(connectionParams, ws) {
                    return new Promise((res) => {
                        const authorization = ws.upgradeReq.headers.authorization;
                        if(!authorization) {
                            res();
                            return;
                        }
                        const token = authorization.split(' ')[1];
                        jwt.verify(token, DEFAULT_SECRET, (err, decoded) => {
                            if(err) {
                                throw new ApolloError("JWT token is invalid.");
                            } else {
                                res({user: decoded});
                            }
                        });
                    });
                },
            }, {
                server: ws,
                path: '/subscriptions',
            });
            return {port, server};
        });
};

if (module.parent) {
    module.exports = { createGraphqlServer, launchServer };
} else {
    launchServer({ port: process.env.PORT, secret: process.env.SECRET }).then(
    /* eslint-disable no-console */
        ({ port }) => {
            console.log(`Server listening on http://localhost:${port}`);
            console.log(` --> GraphQL endpoint: http://localhost:${port}/graphql`);
        },
        error => console.error('Could not start server because', error),
    /* eslint-enable no-console */
    );
}
