const assert = require('assert');
const sinon = require('sinon');
const fs = require('fs');

const { PhotoService } = require('../../graphql/types/photo/PhotoService.js');

var photoService = null;
var photoRepository = {
    findOne: async ({}) => { return {_id: 1, ownerId: 2} },
    findById: async (id) => { return (id) ? {_id: id, ownerId: 2} : null },
    insert: async () => {},
    update: async () => {},
    remove: async () => {},
    list: async () => {},
};

describe("PhotoService", () => {
    before(async () => {
        photoService = new PhotoService(photoRepository, {_id: 2});
    });

    it("[uploadPhoto] should calls insert method of the repository.", async () => {
        const insertSpy = sinon.spy(photoRepository, 'insert');

        const stream = fs.createReadStream('test/test.jpg');
        await photoService.uploadPhoto({stream});

        assert.equal(insertSpy.callCount, 1);

        insertSpy.restore();
    });

    it("[findOnePhoto] should calls findOne method of the repository.", async () => {
        const findOneSpy = sinon.spy(photoRepository, 'findOne');

        await photoService.findOnePhoto({});

        assert.equal(findOneSpy.callCount, 1);

        findOneSpy.restore();
    });

    it("[findOnePhoto] should calls findOne method of the repository.", async () => {
        const findOneSpy = sinon.spy(photoRepository, 'findOne');

        await photoService.findOnePhoto({});

        assert.equal(findOneSpy.callCount, 1);

        findOneSpy.restore();
    });

    it("[updatePhoto] should calls findById and update methods of the repository.", async () => {
        const findByIdSpy = sinon.spy(photoRepository, 'findById');
        const updateSpy = sinon.spy(photoRepository, 'update');

        await photoService.updatePhoto(1, 'test', true);
        await photoService.updatePhoto(1);

        assert.equal(findByIdSpy.callCount, 2);
        assert.equal(updateSpy.callCount, 2);

        findByIdSpy.restore();
        updateSpy.restore();
    });

    it("[removePhoto] should calls findById and remove methods of the repository.", async () => {
        const findByIdSpy = sinon.spy(photoRepository, 'findById');
        const removeSpy = sinon.spy(photoRepository, 'remove');

        await photoService.removePhoto(1);

        assert.equal(findByIdSpy.callCount, 1);
        assert.equal(removeSpy.callCount, 1);

        findByIdSpy.restore();
        removeSpy.restore();
    });

    it("[listPhotos] should calls list method of the repository.", async () => {
        const listSpy = sinon.spy(photoRepository, 'list');
        
        await photoService.listPhotos();

        assert.equal(listSpy.callCount, 1);

        listSpy.restore();
    });

});