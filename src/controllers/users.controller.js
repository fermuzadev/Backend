import UserService from "../dao/user.mongodb.dao.js";
import { NotFoundException } from "../utils.js";

export default class UsersController {
  static getAll = () => {
    return UserService.getAll();
  };
  static create = (data) => {
    return UserService.create(data);
  };
  static getById = async (uid) => {
    const user = await UserService.getById(uid);
    if (!user) {
      throw new NotFoundException("Not Found");
      return user;
    }
  };
  static updateById = async (oid, data) => {
    console.log("method updateById called 👽");
    return "method updateById called 👽";
  };
}
