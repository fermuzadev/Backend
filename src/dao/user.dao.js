import UserModel from "../models/user.model.js";


export default class UserDao {

    static get(criteria = {}) {
        return UserModel.find(criteria);
    }
    static getById(uid) {
        return UserModel.findById(uid);
    }
    static create(data) {
        return UserModel.create(data);
    }
    static updateById(uid, data) {
        return UserModel.findByIdAndUpdate(uid, data);
    }
    static deleteById(uid) {
        return UserModel.findByIdAndDelete(uid);
    }

}

