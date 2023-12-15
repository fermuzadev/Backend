import userModel from "./models/user.model.js";

export default class Userdao {
  getAll = () => {
    return userModel.find();
  };
  getById = (uid) => {
    return userModel.findById(uid);
  };
  create = (data) => {
    return userModel.create(data);
  };
  updateById = (uid, data) => {
    return userModel.updateOne({ _id: uid }, { $set: data });
  };
  deleteById = (uid) => {
    return userModel.deleteOne({ _id: uid });
  };
}
