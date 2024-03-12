import ProductsDto from "../dto/carts.dto.js";
//Aca aplicarian las modificaciones del dto

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    get(criteria = {}) {
        return this.dao.get(criteria)
    }

    getById(pid) {
        return this.dao.getById(pid)
    }

    create(data) {
        return this.dao.create(data)
    }

    update(criteria, data) {
        const newProduct = this.dao.update(criteria, data)
        return newProduct
    }

    deleteById(pid) {
        return this.dao.deleteById(pid)
    }
}
