import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import path from "path";
import {
  getRandomId,
  saveJSONToFile,
  getJSONFromFile,
} from "../utils/utils.js";
import ProductManager from "../ProductManager.js";

const cartPath = path.resolve(__dirname, "../carrito.json");
const prodPath = path.resolve(__dirname, "../productos.json");
const instanceProducts = new ProductManager(prodPath);
const products = await instanceProducts.getProducts();
const onlyId = await products.map((prod) => ({ id: prod.id }));

const cartsRouter = Router();

function getCart() {
  return getJSONFromFile(cartPath);
}

async function addCart() {
  let carts = await getCart();
  let newCart = [
    {
      id: getRandomId(carts),
      products: [],
    },
  ];
  return newCart;
}

cartsRouter.post("/carts", async (req, res) => {
  let newCart;
  let carts = await getCart();
  newCart = await addCart();
  carts.push(...newCart);
  saveJSONToFile(cartPath, carts);
  res.status(201).send(carts);
});

cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  cid = parseInt(cid);
  pid = parseInt(pid);
  let cart = await getCart();
  let cartFind;
  let products = await instanceProducts.getProducts();
  let productFind;
  let newCart = cart;
  try {
    cartFind = cart.find((c) => c.id === cid);
    productFind = await products.find((prod) => prod.id === pid);
    if (!productFind) {
      //if product id exists in products array
      res.status(404).send({
        status: "error",
        message: `The product ${pid} doesn't exists`,
      });
      return;
    }
    if (cartFind) {
      //if cartId exists in cart array
      let { id, products } = cartFind;
      const cartProductFind = products.find((c) => c.product === pid);
      if (cartProductFind) {
        //if product exists inside cart array
        cartProductFind.quantity++;
        newCart = cart;
        saveJSONToFile(cartPath, newCart);
        res.status(201).send(cartFind);
      } else {
        //If the products doesn't exists into the cart array
        products.push({
          product: pid,
          quantity: 1,
        });
        saveJSONToFile(cartPath, cart);
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
  let findCart = cart.find((c) => c.id === cid);
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
  let newCart = cart.filter((cart) => cart.id !== cid);
  try {
    saveJSONToFile(cartPath, newCart);
    res.status(200).send(newCart);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default cartsRouter;
