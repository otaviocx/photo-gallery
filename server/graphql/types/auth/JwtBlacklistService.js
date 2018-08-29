const { ApolloError } = require('apollo-server');
const storage = require('node-persist');

function validateJID(token) {
    if(!token || !token.jti) {
        throw new ApolloError("The given token is invalid.");
    }
}

class JwtBlacklistService {
    constructor() {
        this.storage = storage;
        this.storage.initSync({logging: true});
    }

    revoke(token) {
        validateJID(token);
        return this.storage.setItemSync(token.jti, true);
    }

    isRevoked(token) {
        validateJID(token);
        let revoked = false;
        try {
            revoked = this.storage.getItemSync(token.jti);
        } catch(error) {
            revoked = false;
        }
        return !!revoked;
    }
}

module.exports = {
    JwtBlacklistService,
};