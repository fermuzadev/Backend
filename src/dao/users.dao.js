import UserModel from "./models/user.model.js";

export default class UsersDao {
    static get(criteria = {}) {
        return UserModel.find(criteria)
    }

    static getByID(uid) {
        return UserModel.findById(uid)
    }

    static create(data) {
        return UserModel.create(data)
    }

    static update(criteria, data) {
        const newUser = UserModel.updateOne(criteria, { $set: data })
        return newUser
    }

    static deleteById(uid) {
        return UserModel.deleteOne({ _id: uid })
    }
}