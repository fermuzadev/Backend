import { usersRepository } from "../repositories/index.js";

export default class UsersServices {
    static findAll(filter = {}) {
        return usersRepository.get(filter)
    }

    static findDtoData(filter = {}) {
        return usersRepository.getFilterData(filter)
    }

    static findById(uid) {
        return usersRepository.getByID({ _id: uid })
    }

    static create(payload) {
        return usersRepository.create(payload)
    }

    static update(filter, data) {
        return usersRepository.update(filter, data)
    }

    static deleteById(uid) {
        return usersRepository.deleteById({ _id: uid })
    }
}