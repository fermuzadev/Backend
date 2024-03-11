import productModel from "./models/product.model.js"


export default class ProductsDao {

    static get(criteria = {}) {
        return productModel.find(criteria)
    }

    static getById(pid) {
        return productModel.findById(pid)
    }

    static create(data) {
        return productModel.create(data)
    }

    static update(criteria, data) {
        const newProduct = productModel.updateOne(criteria, { $set: data })
        return newProduct
    }

    static deleteById(pid) {
        return productModel.deleteOne({ _id: pid })
    }
}