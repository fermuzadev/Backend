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

async function addCart(cartId, productID) {
  let newCart = [
    {
      id: cartId,
      products: [
        {
          product: productID,
          quantity: 1,
        },
      ],
    },
  ];
  return newCart;
}

cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  cid = parseInt(cid);
  pid = parseInt(pid);
  let cart = await getCart();
  let cartFind;
  let newCart = cart;
  try {
    cartFind = cart.find((c) => c.id === cid);
    if (cartFind) {
      //Si existe el id de carrito
      let { id, products } = cartFind;
      const cartProductFind = products.find((c) => c.product === pid);
      if (cartProductFind) {
        //si existe el producto dentro del carrito
        cartProductFind.quantity++;
        newCart = cart;
        saveJSONToFile(cartPath, newCart);
        res.status(201).send(newCart);
      } else {
        //si no existe el producto en el carrito
        products.push({
          product: pid,
          quantity: 1,
        });
        saveJSONToFile(cartPath, cart);
        res.status(201).send(cart);
      }
    } else {
      //si no existe el carrito
      newCart = await addCart(cid, pid);
      saveJSONToFile(cartPath, newCart);
      res.status(201).send(newCart);
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
    res.status(200).send(findCart);
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

export default cartsRouter;
