import { Router } from "express";
import { __dirname } from "../utils.js";
import path from "path";

const prodPath = path.resolve(__dirname, "../productos.json");
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager(prodPath);
router.get("/", async (req, res) => {
  try {
    const productsJSON = await productManager.getProducts();
    res.render("home", {
      title: "Websocket - Handlebars ",
      productsJSON,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
