import UserModel from "./models/user.model.js";

export default class UsersDao {
    get(criteria = {}) {
        return UserModel.find(criteria)
    }

    getByID(uid) {
        return UserModel.findById(uid)
    }

    create(data) {
        return UserModel.create(data)
    }

    update(criteria, data) {
        const newUser = UserModel.updateOne(criteria, { $set: data })
        return newUser
    }

    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid })
    }
}