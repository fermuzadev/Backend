//!FS
//!import ProductManager from "../dao/ProductManager.js";
//!import path from "path";
//! const cartPath = path.resolve(__dirname, "../dao/carrito.json");
//! const prodPath = path.resolve(__dirname, "../dao/productos.json");
//! const instanceProducts = new ProductManager(prodPath);
//!import { getRandomId, saveJSONToFile, getJSONFromFile } from "../utils.js";


import CartsServices from "../services/carts.services.js";

export async function getCart(query) {
    const products = await CartsController.get(query)
    return products
}

export default class CartsController {
    static async get(query = {}) {
        const carts = await CartsServices.findAll(query)
        return carts
    }

    static async getById(cid) {
        const cart = await CartsServices.findById(cid)
        if (!cart) {
            throw new Error("Cart not found")
        }
        return cart
    }

    static async findProducts(cid, pid) {
        const cart = await CartsController.getById(cid)

        const productFind = cart.products.find(
            (cartProduct) => cartProduct.productId._id.toString() === pid
        );
        if (productFind) {
            productFind.quantity++
            return cart.products
        }
    }

    static async findProductInCarts(pid) {
        const carts = await CartsController.get();
        for (const cart of carts) {
            const { products } = cart;
            for (const product of products) {
                if (product.productId._id.toString() === pid) {
                    return cart._id;
                }
            }
        }
        return null;
    }
    static async addProductsToCart(cid, data) {
        const cart = await CartsController.getById(cid)
        if (!cart) {
            throw new Error("Cart not found")
        }

        cart.products.push(data)
        return cart
    }

    static async create(data) {
        let carts = await CartsController.get()
        const newCarts = await CartsServices.create(data)
        carts.push(newCarts);
        return newCarts

    }

    static async deleteById(cid) {
        await CartsController.getById(cid)
        await CartsServices.deleteById(cid)
    }

    static async updateSet(query, data) {
        const cart = await CartsController.get(query)
        if (!cart) {
            throw new Error("Cart not found")
        }
        const cartUpdate = await CartsServices.updateSet(query, data)
        return cartUpdate;
    }

    static async update(query, data) {
        const cart = await CartsController.get(query)
        if (!cart) {
            throw new Error("Cart not found")
        }
        const cartUpdate = await CartsServices.update(query, data)
        return cartUpdate;
    }


    static async updateAddToSet(query, data) {
        const cart = await CartsController.get(query)
        if (!cart) {
            throw new Error("Cart not found")
        }
        const cartUpdate = await CartsServices.updateAddSet(query, data)
        return cartUpdate;
    }


}