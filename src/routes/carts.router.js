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
  carts.push(...newCart);
  await cartsModel.create(carts);
  res.status(201).send(newCart);
});

cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  cid = cid;
  pid = pid;
  let cart = await getCart();
  let cartFind;
  let products = await productModel.find();
  let productFind;
  let newCart = cart;
  try {
    cartFind = cart.find((c) => c.id === cid);
    productFind = await products.find((prod) => prod._id === pid);
    if (!productFind) {
      //if product id dont't exists in products array
      res.status(404).send({
        status: "error",
        message: `The product ${pid} doesn't exists`,
      });
      return;
    }
    if (cartFind) {
      //if cartId exists in cart array
      let { id, products } = cartFind;
      const cartProductFind = products.find((c) => c.product._id === pid);
      if (cartProductFind) {
        //if product exists inside cart array
        cartProductFind.quantity++;
        newCart = cart;
        await cartsModel.updateOne({ _id: cid }, newCart);
        res.status(201).send(cartFind);
      } else {
        //If the products doesn't exists into the cart array
        products.push({
          product: pid,
          quantity: 1,
        });
        await cartsModel.updateOne({ _id: cid }, cart);
        res.status(201).send(cartFind);
      }
    } else {
      //If cart doesn't exists
      res.status(404).send({
        status: "error",
        message: `The cart ${cid} doesn't exists`,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

cartsRouter.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  cid = parseInt(cid);
  let cart = await getCart();
  let findCart = await cart.find((c) => c.id === cid);
  if (findCart) {
    res.status(200).send(findCart.products);
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
  cid = parseInt(cid);
  let cart = await getCart();
  let findCart = cart.find((c) => c._id === cid);
  let newCart = await cart.filter((cart) => cart._id !== cid);
  if (!findCart) {
    res.status(404).json({
      message: `Cart ${cid} not found`,
    });
    return;
  }
  try {
    cartsModel.deleteOne({ _id: cid });
    res.status(200).json({ message: `The cart ${cid} was deleted` });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

export default cartsRouter;
