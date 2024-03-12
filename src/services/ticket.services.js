import ticketModel from "../dao/models/ticket.model.js"
export default class TicketServices {
    static findAll(filter = {}) {
        return ticketModel.get(filter)
    }

    static findById(cid) {
        return ticketModel.getById({ _id: cid })
    }

    static create(payload) {
        return ticketModel.create(payload)
    }

    static updateSet(filter, data) {
        return ticketModel.updateSet(filter, data)
    }

    static updateAddSet(filter, data) {
        return ticketModel.updateAddToSet(filter, data)
    }

    static update(filter, data) {
        return ticketModel.update(filter, data)
    }

    static deleteById(cid) {
        return ticketModel.deleteById({ _id: cid })
    }
}