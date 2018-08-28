const { ApolloError } = require('apollo-server');
const storage = require('node-persist');

function validateJID(token) {
    if(!token.jid) {
        throw new ApolloError("The given token is invalid.");
    }
}

class JwtBlacklistService {
    constructor(storage) {
        this.storage = storage;
    }

    static async getInstance() {
        if(!JwtBlacklistService.prototype.instance) {
            await storage.init({logging: true});
            JwtBlacklistService.prototype.instance = new JwtBlacklistService(storage);
        }
        return JwtBlacklistService.prototype.instance;
    }

    async revoke(token) {
        validateJID(token);
        await this.storage.setItem(token.jid, true);
    }

    async isRevoked(token) {
        validateJID(token);
        let revoked = await this.storage.getItem(token.jid);
        console.log(revoked);
        return !!revoked;
    }
}

module.exports = {
    JwtBlacklistService,
};