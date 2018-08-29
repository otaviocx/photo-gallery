const { homedir } = require('os');
const path = require('path');
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

function getIdSeqStorage() {
    if(!Repository.prototype.idSeqStorage) {
        Repository.prototype.idSeqStorage = createStorage({model: 'idSeq'})
    }
    return Repository.prototype.idSeqStorage;
}

class Repository {
    constructor(model) {
        this.model = model;
        this.storage = createStorage({model});
        this.idSeq = getIdSeqStorage();
    }

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
    
    
    async findOne(query, projection) {
        return await this.storage.findOne(query, projection);
    }

    async findById(id, projection) {
        return await this.findOne({_id: parseInt(id, 10)}, projection);
    }

    async list({query, projection, sort}) {
        var cfind = this.storage.cfind(query, projection);
        if(sort) {
            cfind.sort(sort);
        }
        return await cfind.exec();
    }

    async update(id, updatedObject) {
        return this.storage
            .update({_id: parseInt(id, 10)}, updatedObject)
            .then(() => this.findById(parseInt(id, 10)));
    } 

    async remove(id) {
        return this.storage
            .remove({_id: parseInt(id, 10)})
            .then((numRemoved) => !!numRemoved);
    }

    async insert(object) {
        if(!object._id) {
            object._id = await this.getNextId();
        }
        return await this.storage.insert(object);
    }

}

module.exports = { Repository }