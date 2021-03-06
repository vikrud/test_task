const { HttpCodes } = require("./messages/http.codes");
const { customErrors } = require("./messages/errors");

class CustomError {
    constructor(name) {
        this.statusCode = customErrors[name].code;
        this.name = name;
        this.message = customErrors[name].message;
    }
}

function errorHandler(err) {
    let handledError = {
        statusCode: null,
        message: null,
        type: "error",
    };

    if (err instanceof CustomError) {
        handledError.statusCode = err.statusCode;
        handledError.message = err.message;
    } else if (
        err.message === "Validation error" &&
        err.errors[0].validatorKey === "not_unique"
    ) {
        handledError.statusCode =
            customErrors.EMAIL_OR_PHONE_ALREADY_IN_USE.code;
        handledError.message =
            customErrors.EMAIL_OR_PHONE_ALREADY_IN_USE.message;
    } else {
        handledError.statusCode = 500;
        handledError.message = HttpCodes[500];
    }

    return handledError;
}

module.exports = {
    errorHandler,
    CustomError,
};
