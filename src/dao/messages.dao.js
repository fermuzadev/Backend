import MessagesModel from "./models/messages.model.js";


export default class MessagesDao {
    static get(criteria = {}) {
        return MessagesModel.find(criteria)
    }
}