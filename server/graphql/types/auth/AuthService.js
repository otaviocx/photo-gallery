const { AuthenticationError } = require('apollo-server');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

function createJwtToken({_id, username}, secret) {
    return jwt.sign({_id, username}, secret);
}

class AuthService {
    constructor(userService, jwtBlacklistService, secret) {
        this.userService = userService;
        this.jwtBlacklistService = jwtBlacklistService;
        this.secret = secret;
    }

    async login({username, password}) {
        const user = await this.userService.findOneUser({name: username});
        if(!user) {
            throw AuthenticationError("invalid username or password.");
        }
        if(user.password !== this.userService.getHash(password)) {
            throw AuthenticationError("invalid username or password.");
        }
        return createJwtToken(user, this.secret);
    }

    async logout(token) {
        return this.jwtBlacklistService.revoke(token).then(() => {
            this.jwtBlacklistService.isRevoked(token);
        })
    }
}

module.exports = {AuthService}