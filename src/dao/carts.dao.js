import cartsModel from "./models/carts.model.js";

export default class CartsDao {

    static get(criteria = {}) {
        return cartsModel.find(criteria).populate("products.productId")
    }

    static getById(cid) {
        return cartsModel.findById(cid)
    }

    static create(data) {
        return cartsModel.create(data)
    }

    static updateAddToSet(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $addToSet: data })
        return newCart
    }

    static update(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $set: data })
        return newCart
    }

    static updateSet(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $set: data })
        return newCart;
    }

    static deleteById(cid) {
        return cartsModel.deleteOne({ _id: cid })
    }
}