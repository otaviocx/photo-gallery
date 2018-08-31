const assert = require('assert');

const { Repository, clearStorage } = require('../../database/Repository.js');

var repository = null;

describe("Repository", () => {
    beforeEach(async () => {
        const models = ['test', 'test2'];
        const filename = "test/temp";
        clearStorage({models, filename});
        repository = new Repository(models[0], filename);
    });

    it("[getNextId] should increments the id.", async () => {
        const id = await repository.getNextId();
        const newId = await repository.getNextId();
        
        assert.equal(newId, id+1);
    });

    it("[insert] should save the object with the given id.", async () => {
        await repository.insert({_id: 12, name: "Temp 1"});
        
        const obj = await repository.findById(12);

        assert.notEqual(obj, null);
        assert.equal(obj._id, 12);
        assert.equal(obj.name, "Temp 1");
    });

    it("should insert elements and then list all elements sorted.", async () => {
        await repository.insert({name: "Temp 2"});
        await repository.insert({name: "Temp 1"});
        const list = await repository.list({sort: {name: 1}});
        
        assert.equal(list.length, 2);
        assert.equal(list[0].name, "Temp 1");
    });

    it("should insert element and then find by id.", async () => {
        await repository.insert({name: "Temp 1"});
        const obj = await repository.findById(1);
        
        assert.notEqual(obj, null);
        assert.equal(obj._id, 1);
        assert.equal(obj.name, "Temp 1");
    });

    it("should insert and update element.", async () => {
        const tempObj = {name: "Temp 1"};
        await repository.insert(tempObj);
        await repository.update(1, {...tempObj, newField: "test"});
        
        const obj = await repository.findOne({newField: "test"});

        assert.notEqual(obj, null);
        assert.equal(obj._id, 1);
        assert.equal(obj.name, "Temp 1");
        assert.equal(obj.newField, "test");
    });

    it("should insert and remove element.", async () => {
        await repository.insert({name: "Temp 2"});
        await repository.insert({name: "Temp 1"});
        await repository.remove(1);
        
        const list = await repository.list({});

        assert.notEqual(list, null);
        assert.equal(list.length, 1);
        assert.equal(list[0].name, "Temp 1");
    });
});