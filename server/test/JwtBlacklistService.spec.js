const assert = require('assert');
const expect = require('expect.js');
const { JwtBlacklistService } = require('../graphql/types/auth/JwtBlacklistService.js');

var jwtBlacklistService = null;

describe("JwtBlacklistService", () => {
    before(async () => {
        jwtBlacklistService = new JwtBlacklistService();
    });

    it("[revoke] should throws an exception if the token hasn't JTI.", async () => {
        const token = {"_id":6,"name":"Ana","iat":1535573944};
        expect(() => jwtBlacklistService.revoke(token)).to.throwError();
    })

    it("[revoke] should revoke a valid token.", async () => {
        const token = {"_id":6,"name":"Ana","iat":1535573944,"jti":"04dab21c-9953-45c8-bd6d-8f08a2dfeabc"};
        jwtBlacklistService.revoke(token);
        const revoked = jwtBlacklistService.isRevoked(token);
        assert.ok(revoked);
    })

    it("[isRevoke] should return false if some exception throws", async () => {
        const token = {"_id":6,"name":"Ana","iat":1535573944,"jti":"04dab21c-9953-45c8-bd6d-8f08a2dfeabc"};
        const storage = {initSync: () => {}, getItemSync: () => { throw new Error() }};
        jwtBlacklistService = new JwtBlacklistService(storage);
        const revoked = jwtBlacklistService.isRevoked(token);
        assert.equal(revoked, false);
    })
});