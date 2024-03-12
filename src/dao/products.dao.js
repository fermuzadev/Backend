import productModel from "./models/product.model.js"


export default class ProductsDao {

    get(criteria = {}) {
        return productModel.find(criteria)
    }

    getById(pid) {
        return productModel.findById(pid)
    }

    create(data) {
        return productModel.create(data)
    }

    update(criteria, data) {
        const newProduct = productModel.updateOne(criteria, { $set: data })
        return newProduct
    }

    deleteById(pid) {
        return productModel.deleteOne({ _id: pid })
    }
}