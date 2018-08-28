const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { apolloUploadExpress } = require('apollo-upload-server');
const jwt = require('express-jwt');
const { createDatabase } = require('./database');
const createGraphQLSchema = require('./graphql');

const { AuthService } = require('./graphql/types/auth/AuthService');
const { PhotoService } = require('./graphql/types/photo/PhotoService');
const { UserService } = require('./graphql/types/user/UserService');
const { JwtBlacklistService } = require('./graphql/types/auth/JwtBlacklistService');

const { Repository } = require('./database/Repository');

const DEFAULT_PORT = 3001;
const DEFAULT_SECRET = 'totally-unguessable-jwt-secret';

const isRevokedCallback = async (req, payload, done) => {
    const isRevoked = await JwtBlacklistService.getInstance().isRevoked(payload);
    done(null, isRevoked);
}

const createServices = (user) => { 
    const userRepository = new Repository('user');
    const photoRepository = new Repository('photo');
    
    const userService = new UserService(userRepository);
    const photoService = new PhotoService(photoRepository, user);
    const jwtBlacklistService = JwtBlacklistService.getInstance();
    const authService = new AuthService(userService, jwtBlacklistService, DEFAULT_SECRET);
    
    return { 
        userService, 
        photoService, 
        authService, 
    }
}

const createServer = async ({ secret = DEFAULT_SECRET }) => {
    const app = express();
    const schema = await createGraphQLSchema();
    const db = await createDatabase();
    app.use(
        '/graphql',
        cors(),
        jwt({ 
            secret, 
            credentialsRequired: false,
            isRevoked: isRevokedCallback
        }),
        bodyParser.json(),
        apolloUploadExpress(),
        graphqlExpress(({ user }) => ({ 
            schema, 
            context: { 
                user,
                ...createServices(user) 
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
    const server = await createServer({ secret });
    return new Promise((resolve, reject) =>
        server.listen(port, err => (err ? reject(err) : resolve({ port, server }))));
};

if (module.parent) {
    module.exports = { createServer, launchServer };
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
