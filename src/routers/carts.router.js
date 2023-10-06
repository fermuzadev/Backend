import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import path from "path";
import { getRandomId } from "../utils/utils.js";
import ProductManager from "../ProductManager.js";

const cartPath = path.resolve(__dirname, "../carrito.json");
const prodPath = path.resolve(__dirname, "../productos.json");

const cartsRouter = Router();
async function getProducts() {
  const instanceProducts = new ProductManager(prodPath);
  const products = await instanceProducts.getProducts();

  const onlyId = products.map((prod) => ({ id: prod.id }));
}
getProducts();

const addCart = () => {
  const cart = [];
  cart = [
    {
      id: getRandomId(),
      products: [
        {
          product: products.id,
          quantity: 0,
        },
      ],
    },
  ];
};

cartsRouter.post("/carts", (req, res) => {
  const {
    title: prodTitle,
    description: prodDescription,
    code: prodCode,
    price: prodPrice,
    status: prodStatus,
    stock: prodStock,
    category: prodCategory,
    thumbnails: prodThumbnails,
  } = req.body;
});

cartsRouter.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  cid = parseInt(cid);
  let findCart = cart.find((c) => c.id === cid);
  res.status(200).send(findCart);

  res.status(200).send("<h1>Te respondo OK desde cart</h1>");
});

cartsRouter.get("/carts", (req, res) => {});

cartsRouter.post("/carts", (req, res) => {});

export default cartsRouter;
