import { cartsRepository } from "../repositories/index.js";
export default class CartsServices {
    static findAll(filter = {}) {
        return cartsRepository.get(filter)
    }

    static findById(cid) {
        return cartsRepository.getById({ _id: cid })
    }


    static create(payload) {
        return cartsRepository.create(payload)
    }

    static updateSet(filter, data) {
        return cartsRepository.updateSet(filter, data)
    }

    static updateAddSet(filter, data) {
        return cartsRepository.updateAddToSet(filter, data)
    }

    static update(filter, data) {
        return cartsRepository.update(filter, data)
    }

    static deleteById(cid) {
        return cartsRepository.deleteById({ _id: cid })
    }
}