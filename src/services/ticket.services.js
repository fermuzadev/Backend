import ticketModel from "../dao/models/ticket.model.js"
export default class TicketServices {
    static findAll(filter = {}) {
        return ticketModel.find(filter)
    }

    static findById(tid) {
        return ticketModel.findById({ _id: tid })
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

    static deleteById(tid) {
        return ticketModel.deleteById({ _id: tid })
    }
}