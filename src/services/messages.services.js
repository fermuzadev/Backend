import { messagesRepository } from "../repositories/index.js";
export default class MessagesService {
    static findAll(filter = {}) {
        return messagesRepository.get(filter);
    }

}