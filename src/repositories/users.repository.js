import UsersDto from "../dto/users.dto.js";
//Aca aplicarian las modificaciones del dto

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    async get(criteria = {}) {
        return this.dao.get(criteria)
    }

    async getFilterData(data) {
        return new UsersDto(data)
    }


    async getByID(uid) {
        return this.dao.getByID(uid)
    }

    async create(data) {
        return this.dao.create(data)
    }

    async update(criteria, data) {
        const newUser = this.dao.update(criteria, data)
        return newUser
    }

    async deleteById(uid) {
        return this.dao.deleteById(uid)
    }
}