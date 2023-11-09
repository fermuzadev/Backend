//FS
//import ProductManager from "../dao/ProductManager.js";
// import path from "path";
//const prodPath = path.resolve(__dirname, "./dao/productos.json");
// const productManager = new ProductManager(prodPath);

import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let products = await productModel.find();
    products = products.map((p) => p.toJSON());
    res.render("home", {
      title: "MongoDB Deploy ",
      products,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
