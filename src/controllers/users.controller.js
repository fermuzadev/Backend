import UsersService from "../services/users.services.js";

export default class UserController {
    static async get(query = {}) {
        const users = await UsersService.findAll(query);
        return users;
    }
    static async getById(uid) {
        const user = await UsersService.findById(uid);
        if (!user) {
            throw new Error(`User id ${uid} not found 😨.`);
        }
        return user;
    }
    static async create(data) {
        console.log('Creating user');
        const user = await UsersService.create(data);
        console.log('User created');
        return user;
    }
    static async updateById(uid, data) {
        await UserController.getById(uid)
        console.log('Updating user');
        const user = await UsersService.updateById(uid, data);
        console.log('User updated');
        return user;
    }
    static async deleteById(uid) {
        const found = await UserController.getById(uid)
        console.log('Deleting user');
        const user = await UsersService.deleteById(uid);
        console.log('User deleted');
        return user;
    }
}