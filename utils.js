const { MessageToUser } = require("./userMessage");

function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

function insertDataIntoResponseObj(data) {
    let responseObj = {
        success: false,
    };

    if (data.type == "error") {
        responseObj.success = false;
        responseObj.error = data.message;
    } else if (Array.isArray(data)) {
        responseObj.success = true;
        responseObj.data = data;
    } else if (data instanceof MessageToUser) {
        responseObj.success = true;
        responseObj.message = data.message;
    } else if (!isEmpty(data) && (data.bearerToken || data.refreshToken)) {
        responseObj.success = true;
        responseObj.data = [data];
    }

    return responseObj;
}

module.exports = { isEmpty, insertDataIntoResponseObj };
