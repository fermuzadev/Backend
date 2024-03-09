import ToyDao from "../dao/toy.dao.js";


export default class ToysService {
    static findAll(filter = {}) {
        return ToyDao.get(filter);
    }
    static create(payload) {
        return ToyDao.create(payload);
    }

    static findById(tid) {
        return ToyDao.getById(tid);
    }

    static updateById(tid, payload) {
        return ToyDao.updateById(tid, payload);
    }
    static deleteById(tid) {
        return ToyDao.deleteById(tid);
    }

}