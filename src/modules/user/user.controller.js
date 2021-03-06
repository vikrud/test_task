const express = require("express");
const router = express.Router();
const { userService } = require("./user.service");
const { isEmpty, insertDataIntoResponseObj } = require("../../utils.js");
const { errorHandler, CustomError } = require("../../error.handler");
const { MessageToUser } = require("../../message.to.user");
const { authenticateLogin } = require("../auth/auth.local.middleware");
const { authenticateBearerJWT } = require("../auth/auth.bearer.jwt.middleware");
const {
    authenticateRefreshJWT,
} = require("../auth/auth.refresh.jwt.middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function extractUserDataFromRequest(request) {
    const params = ["name", "surname", "email", "phone", "password"];

    let user = { id: null };

    params.forEach(function (item) {
        if (request.body[item]) {
            user[item] = request.body[item];
        }
    });

    if (request.params.id) {
        user.id = request.params.id;
    }

    return user;
}

router.post("/signin", authenticateLogin(), async function (req, res, next) {
    try {
        const userTokens = req.token;

        const responseData = await insertDataIntoResponseObj(userTokens);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.post(
    "/signin/new_token",
    authenticateRefreshJWT(),
    async function (req, res, next) {
        try {
            const userId = req.user.id;
            const newBeaverToken = await userService.getNewBearerToken(userId);

            const responseData = await insertDataIntoResponseObj(
                newBeaverToken
            );

            res.status(200).send(responseData);
        } catch (err) {
            next(err);
        }
    }
);

router.post("/signup", async function (req, res, next) {
    try {
        if (isEmpty(req.body)) {
            throw new CustomError("EMPTY_NEW_USER_DATA");
        }

        const user = await extractUserDataFromRequest(req);
        const userTokens = await userService.createUser(user);

        const responseData = await insertDataIntoResponseObj(userTokens);

        res.status(201).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get("/info", authenticateBearerJWT(), async function (req, res, next) {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);

        const responseData = await insertDataIntoResponseObj([user]);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get("/logout", authenticateBearerJWT(), async function (req, res, next) {
    try {
        const userId = req.user.id;

        await userService.updateUserTokenHash(userId);

        const responseData = await insertDataIntoResponseObj(
            new MessageToUser("USER_LOGOUT_MESSAGE")
        );

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get(
    "/latency",
    authenticateBearerJWT(),
    async function (req, res, next) {
        try {
            res.status(200).send("OK");
        } catch (err) {
            next(err);
        }
    }
);

router.use(async function (err, req, res, next) {
    const error = errorHandler(err);
    const responseData = await insertDataIntoResponseObj(error);

    res.statusCode = error.statusCode;
    res.send(responseData);
    res.end();
});

module.exports = router;
