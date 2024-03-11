import ProductsDao from "../dao/products.dao.js";

export default class ProductsServices {
    static findAll(filter = {}) {
        return ProductsDao.get(filter)
    }

    static findById(pid) {
        return ProductsDao.getById({ _id: pid })
    }

    static create(payload) {
        return ProductsDao.create(payload)
    }

    static update(filter, data) {
        return ProductsDao.update(filter, data)
    }

    static deleteById(uid) {
        return ProductsDao.deleteById({ _id: uid })
    }
}