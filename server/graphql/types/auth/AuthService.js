const { AuthenticationError } = require('apollo-server');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(jwtBlacklistService) {
        this.jwtBlacklistService = jwtBlacklistService;
    }
}

module.exports = {AuthService}