import { Router } from "express";
import CartsController from "../../controllers/carts.controller.js";

const router = Router();

const buildResponse = (cid, data) => {
    let payload = data.products.map(product => product.toJSON())
    return {
        cid,
        payload
    }
}

router.get('/cart/:cid', async (req, res, next) => {
    const { cid } = req.params
    try {
        const cart = await CartsController.getById(cid)
        res.render('cart', buildResponse(cid, cart))
    } catch (error) {
        next(error)
    }
})

export default router