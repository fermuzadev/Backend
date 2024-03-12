
//FS
// import ProductManager from "../dao/ProductManager.js";
// import path from "path";
// const prodPath = path.resolve(__dirname, "./dao/productos.json");
// const testingProducts = new ProductManager(prodPath);

import ProductsServices from "../services/products.services.js";

export default class ProductsController {
    static async get(query = {}) {
        const products = await ProductsServices.findAll(query)
        return products
    }

    static async getById(pid) {
        const product = await ProductsServices.findById(pid)
        if (!product) {
            throw new Error(`Product ${pid} not found`)
        }
        return product
    }
    static async create(data) {
        const newProduct = await ProductsServices.create(data)
        return newProduct
    }

    static async deleteById(pid) {
        await ProductsController.getById(pid)
        await ProductsServices.deleteById(pid)
    }

    static async update(query, data) {
        const product = await ProductsController.get(query)
        if (!product) {
            throw new Error("Product not found")
        }
        const productUpdate = await ProductsServices.update(query, data)
        return productUpdate;
    }
}