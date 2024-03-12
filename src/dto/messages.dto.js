export default class MessagesDto {
    constructor(message) {
        this._id = message._id
        this.user = message.user
        this.message = message.message
    }
}