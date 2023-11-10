//FS
// import ProductManager from "../dao/ProductManager.js";
// import path from "path";
// const prodPath = path.resolve(__dirname, "../dao/productos.json");
//const testingProducts = new ProductManager(prodPath);

import { Router } from "express";
import { __dirname } from "../utils.js";
import productModel from "../dao/models/product.model.js";
import { uploader } from "../utils.js";

const router = Router();
const URL_BASE = "http://localhost:8080/img/";

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("realTimeProducts", {
      title: "MongoDB Real-Time Products ",
      products,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/", uploader.single("thumbnails"), async (req, res) => {
  try {
    const filename = req.file.filename;
    const imageURL = `${URL_BASE}${filename}`;
    const {
      title: prodTitle,
      description: prodDescription,
      code: prodCode,
      price: prodPrice,
      status: prodStatus,
      stock: prodStock,
      category: prodCategory,
    } = req.body;

    const prodThumbnails = imageURL || "";

    if (
      !(
        prodTitle &&
        prodDescription &&
        prodCode &&
        prodPrice &&
        prodStock &&
        prodCategory
      ) ||
      products.find((prod) => prod.code === prodCode)
    ) {
      res.status(400).json({
        status: `One or more required field in the JSON is empty, the product wasn't add or Code ${prodCode} already exists`,
      });
    } else {
      await productModel.create({
        title: prodTitle,
        description: prodDescription,
        code: prodCode,
        price: prodPrice,
        status: prodStatus || true,
        stock: prodStock,
        category: prodCategory,
        thumbnails: prodThumbnails,
      });
      const newProd = await productModel.find();

      res.status(201).send(newProd.find((prod) => prod.code === prodCode));
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
