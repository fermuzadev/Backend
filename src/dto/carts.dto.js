export default class CartsDto {
    constructor(cart) {
        this._id = cart._id
        this.products = cart.products
    }
}