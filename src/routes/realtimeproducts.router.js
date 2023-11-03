import { Router } from "express";
import { __dirname } from "../utils.js";
import ProductManager from "../dao/ProductManager.js";
import path from "path";

const prodPath = path.resolve(__dirname, "../dao/productos.json");

const router = Router();
const testingProducts = new ProductManager(prodPath);

router.get("/", async (req, res) => {
  try {
    const productsJSON = await testingProducts.getProducts();
    res.render("realTimeProducts", {
      title: "Websocket - Handlebars ",
      productsJSON,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
