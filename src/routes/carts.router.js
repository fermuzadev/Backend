//FS
//import ProductManager from "../dao/ProductManager.js";
//import path from "path";
// const cartPath = path.resolve(__dirname, "../dao/carrito.json");
// const prodPath = path.resolve(__dirname, "../dao/productos.json");
// const instanceProducts = new ProductManager(prodPath);
//import { getRandomId, saveJSONToFile, getJSONFromFile } from "../utils.js";

import { Router } from "express";
import { __dirname } from "../utils.js";
import cartsModel from "../dao/models/carts.model.js";
import productModel from "../dao/models/product.model.js";

const cartsRouter = Router();

async function getCart() {
  const products = await cartsModel.find();
  return products;
}

async function addCart() {
  let newCart = await cartsModel.create();
  return newCart;
}

cartsRouter.post("/carts", async (req, res) => {
  let newCart;
  let carts = await getCart();
  newCart = await addCart();
  carts.push(newCart);
  await cartsModel.create(carts);
  res.status(201).send(newCart);
});

cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let cart = await cartsModel.findOne({ _id: cid });
    let product = await productModel.findOne({ _id: pid });

    if (!product) {
      //if product id dont't exists in products array
      res.status(404).send({
        status: "error",
        message: `The product ${pid} doesn't exist`,
      });
      return;
    }
    if (!cart) {
      //if cartId doesn't exits in cart array
      res
        .status(404)
        .json({ status: "Error", message: `The cart ID ${cid} doesn't exist` });
      return;
    }

    const productFind = cart.products.find(
      (cartProduct) => cartProduct.productId === pid
    );

    if (productFind) {
      //if product exists inside cart array
      productFind.quantity++;
      //await cartsModel.updateOne({ _id: cid }, newCart);
      res.status(201).send(cart);
    } else {
      //If the products doesn't exists into the cart array
      cart.products.push({ productId: pid, quantity: 1 });
      //await cartsModel.updateOne({ _id: cid }, { products: cart });
      res.status(201).send(cart);
    }
    await cart.save();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

cartsRouter.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  let cart = await cartsModel.findOne({ _id: cid });
  console.log(cart);
  if (cart) {
    res.status(200).send(cart.products);
  } else {
    res.status(404).json({
      status: "error",
      message: `The id ${cid} is not found`,
    });
  }
});

cartsRouter.get("/carts", async (req, res) => {
  let cart = await getCart();
  try {
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

cartsRouter.delete("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  let cart = await getCart();
  let findCart = await cartsModel.findOne({ _id: cid });
  if (!findCart) {
    res.status(404).json({
      message: `Cart ${cid} not found`,
    });
    return;
  }
  try {
    await cartsModel.deleteOne({ _id: cid });
    res.status(200).json({ message: `The cart ${cid} was deleted` });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

export default cartsRouter;
