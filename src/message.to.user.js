const { messages } = require("./messages/messages");

class MessageToUser {
    constructor(messageTitle, id) {
        this.statusCode = 200;
        this.message = messages[messageTitle];

        if (id) {
            this.message = `${messages[messageTitle]} New file id: ${id}`;
        }
    }
}

module.exports = { MessageToUser };
