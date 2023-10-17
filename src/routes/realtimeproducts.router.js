import { Router } from "express";
import { __dirname } from "../utils.js";
import ProductManager from "../ProductManager.js";
import path from "path";

const prodPath = path.resolve(__dirname, "../productos.json");
const testingProducts = new ProductManager(prodPath);

const router = Router();

router.get("/", async (req, res) => {
  const productsJSON = await testingProducts.getProducts();

  res.render("realTimeProducts", {
    title: "Websocket - Handlebars ",
    productsJSON,
  });
});

export default router;
