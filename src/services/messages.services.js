import MessagesDao from "../dao/messages.dao.js";

export default class MessagesService {
    static findAll(filter = {}) {
        return MessagesDao.get(filter);
    }

}