import { Router } from "express";
import CartsController from "../../controllers/carts.controller.js";
import ProductsController from "../../controllers/products.controller.js";

const cartsRouter = Router();

//!HELPERS

//!POST METHODS

cartsRouter.post("/carts", async (req, res) => {
  const newCart = await CartsController.create();
  res.status(201).send(newCart);
});

cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let cart = await CartsController.get()
    let product = await ProductsController.getById(pid);
    if (!product) {
      //!if product id dont't exists in products array
      res.status(404).send({
        status: "error",
        message: `The product ${pid} doesn't exist`,
      });
      return;
    }
    if (!cart) {
      //!if cartId doesn't exits in cart array
      res
        .status(404)
        .json({ status: "Error", message: `The cart ID ${cid} doesn't exist` });
      return;
    }
    let productFind = await CartsController.findProducts(cid, pid)
    if (productFind) {
      //!if product exists inside cart array
      await CartsController.update({ _id: cid }, { products: productFind });
      return res.status(201).json(productFind);
    } else {
      //!If the products doesn't exists into the cart array
      const newProduct = await CartsController.updateAddToSet({ _id: cid }, { products: { productId: pid, quantity: 1 } });
      res.status(201).json(newProduct);
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//!GET METHODS
cartsRouter.get("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  let cart = await CartsController.getById(cid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({
      status: "error",
      message: `The id ${cid} is not found`,
    });
  }
});

cartsRouter.get("/carts", async (req, res) => {
  let cart = await getCart();
  try {
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

//!PUT METHODS

//!This function update the cart with a put method with postman in an Array format(it replaces the quantity, it isn't an add method)
cartsRouter.put("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  try {
    //!Validate products & data format => Array
    if (!products || !Array.isArray(products)) {
      res.status(404).send("Not a valid data format");
      return;
    }
    //!I use find&update cause it do the two action and return the object updated with new : true
    const result = await CartsController.updateSet(
      { _id: cid },
      { products: products }
    );
    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

cartsRouter.put("/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity) {
      res
        .status(404)
        .json(`The quantity must be a number for the product ${pid}`);
      return;
    }
    const result = await CartsController.update(
      { _id: cid, "products.productId": pid },
      { "products.$.quantity": quantity }
    );
    res.status(200).send("Product updated");
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
//!DELETE METHODS

cartsRouter.delete("/carts/:cid", async (req, res) => {
  let { cid } = req.params;
  let findCart = await CartsController.getById(cid);
  if (!findCart) {
    res.status(404).json({
      message: `Cart ${cid} not found`,
    });
    return;
  }
  try {
    await CartsController.update({ _id: cid }, { products: [] });
    res.status(200).json({ message: `The cart ${cid} was empty` });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

cartsRouter.delete("/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  let findCart = await CartsController.getById(cid);
  if (!findCart) {
    res.status(404).json({
      message: `Cart ${cid} not found`,
    });
    return;
  }
  try {
    const indexProduct = findCart.products.findIndex(
      (cartProduct) => cartProduct.productId.toString() === pid
    );
    //!If its founded
    if (indexProduct !== -1) {
      findCart.products.splice(indexProduct, 1);
      await CartsController.update(
        { _id: cid },
        { products: findCart.products }
      );
      res
        .status(200)
        .json({ message: `The product ${pid} was deleted on ${cid} cart` });
    } else {
      res
        .status(404)
        .json({ message: `Product ${pid} doesn't found in the cart ${cid}` });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

export default cartsRouter;
