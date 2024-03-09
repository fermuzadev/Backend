import toyModel from "../models/toy.model.js";
// The same methods than controller
export default class ToyDao {
    static create(data) {
        return toyModel.create(data)
    }

    static get(criteria = {}) {
        return toyModel.find(criteria);
    }

    static getById(tid) {
        return toyModel.findById(tid);
    }

    static updateById(tid, data) {
        return toyModel.findByIdAndUpdate(tid, data);
    }

    static deleteById(tid) {
        return toyModel.findByIdAndDelete(tid);
    }
}