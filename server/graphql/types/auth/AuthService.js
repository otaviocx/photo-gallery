const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const uuidv4 = require("uuid/v4");

function createJwtToken({_id, name}, secret) {
    return jwt.sign({_id, name}, secret, {jwtid: uuidv4()});
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
            throw new AuthenticationError("invalid username or password.");
        }
        if(user.password !== this.userService.getHash(password)) {
            throw new AuthenticationError("invalid username or password.");
        }
        return createJwtToken(user, this.secret);
    }

    async logout(token) {
        this.jwtBlacklistService.revoke(token);
        return this.jwtBlacklistService.isRevoked(token);
    }
}

module.exports = {AuthService}