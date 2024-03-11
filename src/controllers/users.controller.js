import UsersServices from "../services/users.services.js";

export default class UsersController {
    static async get(query = {}) {
        const users = await UsersServices.findAll(query)
        return users
    }

    static async getById(uid) {
        const user = await UsersServices.findById(uid)
        if (!user) {
            throw new Error("User not found")
        }
        return user;
    }

    static async create(data) {
        const newUser = await UsersServices.create(data)
        return newUser;
    }

    static async deleteById(uid) {
        await UsersController.getById(uid)
        await UsersServices.deleteById(uid)
    }

    static async update(query, data) {
        const user = await UsersController.get(query)
        if (!user) {
            throw new Error("User not found")
        }
        const userUpdate = await UsersServices.update(query, data)
        return userUpdate;
    }
}