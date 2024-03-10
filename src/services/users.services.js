import UsersDao from "../dao/users.dao.js";


export default class UsersServices {
    static findAll(filter = {}) {
        return UsersDao.get(filter)
    }

    static findById(uid) {
        return UsersDao.getById({ _id: uid })
    }

    static create(payload) {
        return UsersDao.create(payload)
    }

    static update(filter, data) {
        return UsersDao.update(filter, data)
    }

    static deleteById(uid) {
        return UsersDao.deleteById({ _id: uid })
    }
}