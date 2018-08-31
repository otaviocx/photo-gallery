const assert = require('assert');
const expect = require('expect.js');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { assertThrowsAsync } = require('./assertThrowsAsync');
const { AuthService } = require('../../graphql/types/auth/AuthService.js');

var authService = null;
var jwtBlacklistMock = {revoke: () => true, isRevoked: () => true}
const userMock = {_id: 1, name: "Maria", password: "hash"};
var userServiceMock = {
    findOneUser: ({name}) => { return (name) ? userMock : null },
    getHash: (value) => value
};
var secretMock = "just-a-test";

describe("AuthService", () => {
    before(async () => {
        authService = new AuthService(userServiceMock, jwtBlacklistMock, secretMock);
    });

    it("[logout] should revoke token.", async () => {
        const revokeSpy = sinon.spy(jwtBlacklistMock, 'revoke');
        await authService.logout('test bla bla');
        
        assert.equal(revokeSpy.callCount, 1);
        revokeSpy.restore();
    });

    it("[login] should return a valid token.", async () => {
        const getHashSpy = sinon.spy(userServiceMock, 'getHash');
        const token = await authService.login({username: "Maria", password: "hash"});
        const user = jwt.verify(token, secretMock);
        assert.equal(user._id, userMock._id);
        assert.equal(user.name, userMock.name);
        assert.equal(getHashSpy.callCount, 1);
        getHashSpy.restore();
    });

    it("[login] should validate the user.", async () => {
        await assertThrowsAsync(async() => { await authService.login({}) });
    });

    it("[login] should validate password.", async () => {
        await assertThrowsAsync(async() => { 
            await authService.login({username: "Maria", password: "pass"}) 
        });
    });

});