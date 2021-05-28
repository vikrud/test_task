const customErrors = {
    CANT_FIND_USER_BY_ID: {
        code: 404,
        message: "Can't find user with such ID",
    },
    EMPTY_NEW_USER_DATA: {
        code: 400,
        message: "New user data is empty",
    },
    EMPTY_EMAIL_PASS_DATA: {
        code: 400,
        message: "User data with email and password is empty",
    },
    EMAIL_OR_PHONE_ALREADY_IN_USE: {
        code: 400,
        message: "The user's email or phone is already in use!",
    },
    EMAIL_OR_PHONE_IS_INCORRECT: {
        code: 401,
        message: "The entered users id (email or phone) is incorrect",
    },
    PASSWORD_IS_INCORRECT: {
        code: 401,
        message: "The entered password is incorrect",
    },
    UNAUTHORISED: {
        code: 401,
        message: "UNAUTHORISED!",
    },
    CANT_FIND_FILE_BY_ID: {
        code: 404,
        message: "Can't find file with such ID",
    },
};

module.exports = { customErrors };
