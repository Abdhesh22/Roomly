const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = class BaseDAO {
    /**
     * @type {mongoose.Model}
     */
    model;

    /**
     *
     * @param {mongoose.Model} model
     */
    constructor(model) {
        this.model = model;
    }

    create(document) {
        console.log("document: ", document);
        return this.model.create(document);
    }

    insertMany(documents) {
        return this.model.insertMany(documents);
    }

    findOne(query, projection = {}) {
        return this.model.findOne(query, projection);
    }

    findById(id, projection = {}) {
        return this.model.findById(new ObjectId(id), projection);
    }

    find(query, projection = {}) {
        return this.model.find(query, projection);
    }

    updateOne(query, data) {
        return this.model.updateOne(query, data);
    }

    updateById(id, payload) {
        return this.model.updateOne({ _id: new ObjectId(id) }, payload);
    }

    updateMany(query, data) {
        return this.model.updateMany(query, data);
    }

    deleteOne(query) {
        return this.model.deleteOne(query);
    }

    deleteById(id) {
        return this.model.deleteOne({ _id: new ObjectId(id) });
    }

    deleteMany(query) {
        return this.model.deleteMany(query);
    }

    countDocuments(query) {
        return this.model.countDocuments(query);
    }

    aggregate(pipeline) {
        return this.model.aggregate(pipeline);
    }

    findOneAndUpdate(query, payload, options = {}) {
        return this.model.findOneAndUpdate(query, payload, options);
    }
};
