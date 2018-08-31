const assert = require('assert');
const sinon = require('sinon');

const { assertThrowsAsync } = require('./assertThrowsAsync');
const { UserService } = require('../../graphql/types/user/UserService.js');

var userService = null;
var userRepository = {
    findOne: async ({name}) => { return (name) ? {_id: 1, name} : null },
    findById: async (id) => { return (id) ? {_id: id, name: "Test"} : null },
    insert: async ({name}) => { 
        if(name === "AlreadyInUse") throw { errorType: "uniqueViolated" } 
    },
    update: async () => {},
    remove: async () => {},
};

describe("UserService", () => {
    before(async () => {
        userService = new UserService(userRepository);
    });

    it("[getHash] should returns the correct hash.", async () => {
        const hash = await userService.getHash("Test");
        
        assert.equal(hash, '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25');
    });

    it("[findOneUser] should calls findOne method of the repository.", async () => {
        const findOneSpy = sinon.spy(userRepository, 'findOne');

        await userService.findOneUser({name: 'Test'});

        assert.equal(findOneSpy.callCount, 1);
    });

    it("[updateUser] should calls findById and update methods of the repository.", async () => {
        const findByIdSpy = sinon.spy(userRepository, 'findById');
        const updateSpy = sinon.spy(userRepository, 'update');

        await userService.updateUser(1, {name: 'Test'});

        assert.equal(findByIdSpy.callCount, 1);
        assert.equal(updateSpy.callCount, 1);
    });

    it("[updateUser] should returns 0 when user was not found.", async () => {
        const result = await userService.updateUser(0, {name: 'Test'});

        assert.equal(result, 0);
    });

    it("[createUser] should calls insert method of the repository.", async () => {
        const insertSpy = sinon.spy(userRepository, 'insert');

        await userService.createUser({username: 'Test', password: "test"});

        assert.equal(insertSpy.callCount, 1);
    });

    it("[createUser] should throws exception when Repository throws.", async () => {
        await assertThrowsAsync(async() => { 
            await userService.createUser({username: 'AlreadyInUse', password: ''});
        });
    });

});