// import MessagesDto from "../dto/carts.dto.js";
//Aca aplicarian las modificaciones del dto

export default class MessagesRepository {
    constructor(dao) {
        this.dao = dao
    }
    get(criteria = {}) {
        return this.dao.get(criteria)
    }
}