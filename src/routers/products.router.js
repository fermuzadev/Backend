import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { __dirname } from "../utils/utils.js";
import path from "path";

const prodPath = path.resolve(__dirname, "../productos.json");

const prodRouter = Router();

const testingProducts = new ProductManager(prodPath);

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

prodRouter.get("/products/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    pid = parseInt(pid);
    const productById = await testingProducts.getProductById(pid);
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

prodRouter.post("/products", async (req, res) => {
  const products = await testingProducts.getProducts();
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
    await testingProducts.addProduct({
      title: prodTitle,
      description: prodDescription,
      code: prodCode,
      price: prodPrice,
      status: prodStatus || true,
      stock: prodStock,
      category: prodCategory,
      thumbnails: prodThumbnails || "",
    });
    const newProd = await testingProducts.getProducts();
    try {
      res.status(201).send(newProd);
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
});

prodRouter.put("/products/:pid", async (req, res) => {
  let { pid } = req.params;
  pid = parseInt(pid);
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
  await testingProducts.updateProduct(
    pid,
    prodTitle,
    prodDescription,
    prodCode,
    prodPrice,
    prodStatus,
    prodStock,
    prodCategory,
    prodThumbnails
  );
  const products = await testingProducts.getProducts();
  try {
    await res.status(200).send(products);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

prodRouter.delete("/products/:pid", async (req, res) => {
  let { pid } = req.params;
  pid = parseInt(pid);
  await testingProducts.deleteProduct(pid);
  const products = await testingProducts.getProducts();
  try {
    res.status(200).send(products);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default prodRouter;
