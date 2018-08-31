const { homedir } = require('os');
const path = require('path');
const fs = require('fs');
const Datastore = require('nedb-promise');
const pkg = require('../package.json');

function defaultDatabaseFilename() {
    return path.join(homedir(), `.${pkg.name}`);
}

function createStorage({ model, filename = defaultDatabaseFilename(), autoload = true, ...rest } = {}) {
    return new Datastore({
        filename: `${filename}.${model}.db`,
        autoload,
        ...rest,
    });
}

function removeStorageIfExists({model, filename}) {
    const path = `${filename}.${model}.db`;
    if(fs.existsSync(path)) {
        return fs.unlinkSync(path);
    }
}

function clearStorage({models, filename}) {
    models.forEach(function(model) {
        removeStorageIfExists({model, filename});
    });
    removeStorageIfExists({model: 'idSeq', filename});
    Repository.prototype.idSeqStorage = null;
}

function getIdSeqStorage(filename) {
    if(!Repository.prototype.idSeqStorage) {
        Repository.prototype.idSeqStorage = createStorage({model: 'idSeq', ...filename && {filename}})
    }
    return Repository.prototype.idSeqStorage;
}

/**
 * Repository abstracts the way that the application persist and query data.
 */
class Repository {
    constructor(model, filename) {
        this.model = model;
        this.storage = createStorage({model, ...filename && {filename}});
        this.idSeq = getIdSeqStorage(filename);
    }

    /**
     * Returns the next id for the current model.
     */
    async getNextId() {
        const seq = await this.idSeq.findOne({
            _id: this.model,
        });
        let oldId = 0;
        if(!seq) {
            this.idSeq.insert({
                _id: this.model,
                value: oldId
            })
        } else {
            oldId = seq.value;
        }
        const newId = oldId + 1;
        return this.idSeq.update({ _id: this.model }, { value: newId }).then(() => newId);
    }
    
    /**
     * Find one element based in a object query.
     * @param {Object} query The query object, composed by the fields of the model. 
     * @param {*} projection What fields should be returned.
     */
    async findOne(query, projection) {
        return await this.storage.findOne(query, projection);
    }

    /**
     * Find one element by id.
     * @param {ID} id The Id of an element
     * @param {*} projection What fields should be returned.
     */
    async findById(id, projection) {
        return await this.findOne({_id: parseInt(id, 10)}, projection);
    }

    /**
     * Lists the elements based in one query object and 
     * sort the results based on the sort param.
     */
    async list({query, projection, sort}) {
        var cfind = this.storage.cfind(query, projection);
        if(sort) {
            cfind.sort(sort);
        }
        return await cfind.exec();
    }

    /**
     * Updates an element quering by its id.
     * @param {ID} id The id of an element
     * @param {Object} updatedObject The new object to replace te older one.
     */
    async update(id, updatedObject) {
        return this.storage
            .update({_id: parseInt(id, 10)}, updatedObject)
            .then(() => this.findById(parseInt(id, 10)));
    } 

    /**
     * Removes an element quering by its id. Return true if success.
     * @param {ID} id The id of an element.
     */
    async remove(id) {
        return this.storage
            .remove({_id: parseInt(id, 10)})
            .then((numRemoved) => !!numRemoved);
    }

    /**
     * Insert an object into the current model.
     * @param {Object} object The object to insert.
     */
    async insert(object) {
        if(!object._id) {
            object._id = await this.getNextId();
        }
        return await this.storage.insert(object);
    }

}

module.exports = { 
    Repository,
    createStorage,
    clearStorage,
}