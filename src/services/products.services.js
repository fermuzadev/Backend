import { productsRepository } from "../repositories/index.js";
export default class ProductsServices {
    static findAll(filter = {}) {
        return productsRepository.get(filter)
    }

    static findById(pid) {
        return productsRepository.getById({ _id: pid })
    }

    static create(payload) {
        return productsRepository.create(payload)
    }

    static update(filter, data) {
        return productsRepository.update(filter, data)
    }

    static deleteById(uid) {
        return productsRepository.deleteById({ _id: uid })
    }
}