import BusinessService from "../dao/business.mongodb.dao.js";
import { NotFoundException } from "../utils.js";

export default class BusinessController {
  static getAll = async () => {
    console.log("method getAll called 👽");
    return BusinessService.getAll();
  };

  static create = async (data) => {
    return BusinessService.create(data);
  };

  static addProduct = async (bid, data) => {
    const business = await BusinessController.getById(bid);
    business.products.push(data);
    await BusinessController.updateById(bid, {
      products: [...business.products, data],
    });
  };

  static getById = async (bid) => {
    const business = await BusinessService.getById(bid);
    if (!business) {
      throw new Exception("Not Found");
    }
    return business;
  };

  static updateById = async (bid, data) => {
    return BusinessService.updateById(bid, data);
  };
}
