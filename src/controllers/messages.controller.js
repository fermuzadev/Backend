import MessagesService from "../services/messages.services.js";


export default class MessagesController {
    static async get(query = {}) {
        const messages = await MessagesService.findAll(query)
    }
}