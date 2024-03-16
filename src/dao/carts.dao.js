import cartsModel from "./models/carts.model.js";

export default class CartsDao {

    get(criteria = {}) {
        return cartsModel.find(criteria).populate("products.productId")
    }

    getById(cid) {
        return cartsModel.findById(cid).populate("products.productId")
    }


    create(data) {
        return cartsModel.create(data)
    }

    updateAddToSet(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $addToSet: data })
        return newCart
    }

    update(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $set: data })
        return newCart
    }

    updateSet(criteria, data) {
        const newCart = cartsModel.updateOne(criteria, { $set: data })
        return newCart;
    }

    deleteById(cid) {
        return cartsModel.deleteOne({ _id: cid })
    }
}