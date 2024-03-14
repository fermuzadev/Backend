import { Router } from "express";
import CartsController from "../../controllers/carts.controller.js";

const router = Router();

const buildResponse = (cid, data, user) => {
    let payload = data.products.map(product => product.toJSON())
    let cartId = user.carts.map(cart => cart.cartId)
    return {
        cid,
        payload,
        user,
        cartId
    }
}

router.get('/cart/:cid', async (req, res, next) => {
    const { cid } = req.params
    if (!req.session.user) {
        return res.redirect("/api/login");
    }
    try {
        const cart = await CartsController.getById(cid)
        res.render('cart', buildResponse(cid, cart, req.session.user))
    } catch (error) {
        next(error)
    }
})

export default router