import { Router } from "express";
import passport from "passport";
import CartsController from "../../controllers/carts.controller.js";
import ProductsController from "../../controllers/products.controller.js";
import UsersController from "../../controllers/users.controller.js";
import { authorizationMiddleware } from "../../utils.js";
import TicketServices from "../../services/ticket.services.js";
import EmailController from "../../controllers/email.controller.js";


const cartsRouter = Router();

//!HELPERS

//!POST METHODS

cartsRouter.post("/carts", async (req, res) => {
  const newCart = await CartsController.create();
  res.status(201).json(newCart);
});

cartsRouter.post("/carts/:cid/product/:pid", passport.authenticate('jwt', { session: false }), async (req, res) => {
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
    const userActive = await UsersController.getById(req.user.id)
    const { carts } = userActive
    const cartUser = carts.find(cart => cart.cartId.toString() === cid)
    if (!cartUser) {
      return res.status(403).json({ message: 'No permissions' })
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

cartsRouter.post("/carts/:cid/purchase", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartsController.getById(cid);
    const { products } = cart
    let productPurchaseId = []
    let ticket = {
      amount: 0
    }

    for (const product of products) {
      const productFind = await ProductsController.getById(product.productId._id)
      if (product.quantity <= 0 || productFind.stock < product.quantity) {
        continue;
      }
      productPurchaseId.push(product.productId._id)
      await ProductsController.update({ _id: product.productId }, { stock: productFind.stock - product.quantity })
      ticket.amount += productFind.price * product.quantity
    }
    if (ticket.amount === 0) {
      return res.status(400).json({ status: "error", message: "The cart is empty" })
    }
    ticket = {
      ...ticket,
      code: Date.now(),
      purchase_datetime: new Date().toLocaleString(),
      purchaser: req.user.email
    }

    const ticketCreated = await TicketServices.create(ticket)
    const ticketEmail = await TicketServices.findAll({ code: ticketCreated.code })
    await EmailController.sendTicketEmail(ticketEmail[0])
    const cartUpdate = await CartsController.getById(cid);
    const { products: productsUpdate } = cartUpdate
    const updatedProducts = products.filter(product => !productPurchaseId.includes(product.productId._id));
    await CartsController.update({ _id: cid }, { products: updatedProducts })

    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message })
  }
})

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
  let cart = await CartsController.get();
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
      (cartProduct) => cartProduct.productId._id.toString() === pid
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
