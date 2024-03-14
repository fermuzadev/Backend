export default class UsersDto {
    //Aca se agrega o sacan datos para enviar, luego en el service hago map para devolver el objeto parametrizado con la clase new UsersDto con
    constructor(user) {
        // this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        // this.dni = user.dni
        // this.provider = user.provider
        this.email = user.email
        // this.password = user.password
        // this.status = user.status
        this.role = user.role
        this.carts = user.carts.map(cart => cart.cartId)
    }
}