

import { Router } from "express";
import passport from "passport";
import config from "../../config/config.js";
import ProductModel from "../../dao/models/product.model.js";
import ProductsController from "../../controllers/products.controller.js";
import { uploader, __dirname, authorizationMiddleware } from "../../utils.js";
import mongoosePaginate from "mongoose-paginate-v2";

const prodRouter = Router();
const URL_BASE = config.url;
const URL_PRODUCTS = `/api/products`;


const buildResponse = (data, user) => {
  return {
    status: "success",
    payload: data.docs.map((product) => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    user,
    cartId: user.carts.map((cart) => cart.cartId),
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage
      ? `${URL_PRODUCTS}?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ""
      }${data.stock ? `&stock=${data.stock}` : ""}`
      : "",
    nextLink: data.hasNextPage
      ? `${URL_PRODUCTS}?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ""
      }${data.stock ? `&stock=${data.stock}` : ""}`
      : "",
  };
};

prodRouter.get("/products", async (req, res) => {
  try {
    let { limit = 10, page = 1, category, stock, query, sort } = req.query; //query, sort
    const opts = { page, limit, sort: { price: sort || "asc" } };
    const criteria = {};
    if (category) {
      criteria.category = category;
    }
    if (stock) {
      criteria.stock = stock;
    }
    if (query) {
      query = JSON.parse(query);
      criteria.query = query;
    }
    const paginate = await ProductModel.paginate(criteria, opts);
    res
      .status(200)
      .render("products", buildResponse({ ...paginate, category, stock }, req.session.user));
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
    let productById = await ProductsController.getById(pid);
    const paginateId = await ProductModel.paginate({ _id: pid }, { limit: 1 });
    if (!productById) {
      res.json({
        error: "Product Not Found",
        message: `The product id ${pid} not found`,
      });
    } else {
      res.render("home", buildResponse(paginateId));
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

prodRouter.post(
  "/products", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"),
  uploader.single("thumbnails"),
  async (req, res) => {
    try {
      if (req.file) {
        const filename = req.file.filename;
        const imageURL = `/${filename}`;
        let thumbnails = imageURL
      }
      let {
        title: prodTitle,
        description: prodDescription,
        code: prodCode,
        price: prodPrice,
        status: prodStatus,
        stock: prodStock,
        category: prodCategory,
        thumbnails: prodThumbnails,
      } = req.body;
      const products = await ProductsController.get();

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

        await ProductsController.create({
          title: prodTitle,
          description: prodDescription,
          code: prodCode,
          price: prodPrice,
          status: prodStatus || true,
          stock: prodStock,
          category: prodCategory,
          thumbnails: prodThumbnails,
        });

        const newProd = await ProductsController.get();

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

prodRouter.put("/products/:pid", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
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
  await ProductsController.update(
    { _id: pid },
    {
      title: prodTitle,
      description: prodDescription,
      code: prodCode,
      price: prodPrice,
      status: prodStatus,
      stock: prodStock,
      category: prodCategory,
      thumbnails: prodThumbnails,
    },
  );

  try {
    res.status(204).end();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

prodRouter.delete("/products/:pid", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  let { pid } = req.params;
  await ProductsController.deleteById(pid);
  const products = await ProductsController.get()
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
