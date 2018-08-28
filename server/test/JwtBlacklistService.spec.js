const assert = require('assert');
const { JwtBlacklistService } = require('../graphql/types/auth/JwtBlacklistService.js');

var jwtBlacklistService;

describe("JwtBlacklistService", () => {
    before(async () => {
        jwtBlacklistService = await JwtBlacklistService.getInstance();
    });

    it("should throws an exception if the token hasn't JID.", async () => {
        jwtBlacklistService.revoke('asdfasdfasdfasd');
    })
});