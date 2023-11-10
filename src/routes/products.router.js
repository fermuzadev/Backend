//FS
// import ProductManager from "../dao/ProductManager.js";
// import path from "path";
// const prodPath = path.resolve(__dirname, "./dao/productos.json");
// const testingProducts = new ProductManager(prodPath);

import { Router } from "express";
import { __dirname } from "../utils.js";

import productModel from "../dao/models/product.model.js";
import { uploader } from "../utils.js";

const prodRouter = Router();
const URL_BASE = `http://localhost:8080/img/`;
prodRouter.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
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

prodRouter.get("/products/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    const productById = await productModel.findById(pid);
    if (!productById) {
      res.json({
        error: "Product Not Found",
        message: `The product id ${pid} not found`,
      });
    } else {
      res.send(productById);
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

prodRouter.post(
  "/products",
  uploader.single("thumbnails"),
  async (req, res) => {
    try {
      console.log("Received file:", req.file);
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
      const products = await productModel.find();

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
  }
);

prodRouter.put("/products/:pid", async (req, res) => {
  let { pid } = req.params;
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
  await productModel.updateOne(
    { _id: pid },
    {
      $set: {
        title: prodTitle,
        description: prodDescription,
        code: prodCode,
        price: prodPrice,
        status: prodStatus,
        stock: prodStock,
        category: prodCategory,
        thumbnails: prodThumbnails,
      },
    }
  );
  const products = await productModel.find();
  try {
    await res.status(204).end();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

prodRouter.delete("/products/:pid", async (req, res) => {
  let { pid } = req.params;
  await productModel.deleteOne({ _id: pid });
  const products = await productModel.find();
  try {
    if (products.find((prod) => prod._id === pid)) {
      res.status(200).json({ message: `The product id ${pid} was deleted` });
    } else {
      res.status(404).json({ message: `The product ${pid} not found` });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default prodRouter;
