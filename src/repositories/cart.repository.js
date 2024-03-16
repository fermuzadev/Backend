import CartsDto from "../dto/carts.dto.js";
//Aca aplicarian las modificaciones del dto
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    get(filter = {}) {
        return this.dao.get(filter)
    }

    getById(cid) {
        return this.dao.getById(cid)
    }


    async create(data) {
        //modificaciones a la db o hacia afuera
        // const newData = {

        // }
        const newCart = await this.dao.create(data)
        return newCart
    }

    async updateAddToSet(criteria, data) {
        const newCart = await this.dao.updateAddToSet(criteria, data)
        return newCart
    }

    async update(criteria, data) {
        const newCart = await this.dao.update(criteria, data)
        return newCart
    }

    async updateSet(criteria, data) {
        const newCart = await this.dao.updateSet(criteria, data)
        return newCart;
    }

    deleteById(cid) {
        return this.dao.deleteById(cid)
    }
}