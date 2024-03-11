import CartsDao from "../dao/carts.dao.js";

export default class CartsServices {
    static findAll(filter = {}) {
        return CartsDao.get(filter)
    }

    static findById(cid) {
        return CartsDao.getById({ _id: cid })
    }

    static create(payload) {
        return CartsDao.create(payload)
    }

    static updateSet(filter, data) {
        return CartsDao.updateSet(filter, data)
    }

    static updateAddSet(filter, data) {
        return CartsDao.updateAddToSet(filter, data)
    }

    static update(filter, data) {
        return CartsDao.update(filter, data)
    }

    static deleteById(cid) {
        return CartsDao.deleteById({ _id: cid })
    }
}