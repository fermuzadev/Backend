import UserDao from "../dao/user.dao.js";


export default class UsersService {
    static findAll(filter = {}) {
        return UserDao.get(filter);
    }
    static create(payload) {
        return UserDao.create(payload);
    }

    static findById(uid) {
        return UserDao.getById(uid);
    }

    static updateById(uid, payload) {
        return UserDao.updateById(uid, payload);
    }
    static deleteById(uid) {
        return UserDao.deleteById(uid);
    }

}