import MessagesModel from "./models/messages.model.js";


export default class MessagesDao {
    get(criteria = {}) {
        return MessagesModel.find(criteria)
    }
}