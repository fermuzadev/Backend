import { Router } from "express";
import ProductManager from "../ProductManager.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsPath = path.resolve(__dirname, "../productos.json");

const prodRouter = Router();

const testingProducts = new ProductManager(productsPath);

prodRouter.get("/products", async (req, res) => {
  try {
    const products = await testingProducts.getProducts();
    const { limit } = req.query;
    let prodLimit;
    if (limit) {
      prodLimit = products.slice(0, limit);
      res.status(200).send(prodLimit);
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

export default prodRouter;
