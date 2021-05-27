const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { isEmpty } = require("../../utils.js");
const { userService } = require("../user/user.service");
const { CustomError } = require("../../errorHandler");

const localStrategy = new LocalStrategy(
    {
        usernameField: "id",
        passwordField: "password",
    },
    async function (email, password, done) {
        try {
            const userTokens = await userService.userSignIn(email, password);
            return done(null, userTokens);
        } catch (err) {
            done(err);
        }
    }
);

function authenticateLogin() {
    return function (req, res, next) {
        passport.authenticate(
            localStrategy,
            { session: false },
            (error, tokens, info) => {
                if (isEmpty(req.body)) {
                    throw new CustomError("EMPTY_EMAIL_PASS_DATA");
                }

                if (error) {
                    return next(error);
                }
                if (!tokens) {
                    return next(new CustomError("UNAUTHORISED"));
                }

                req.token = tokens;
                next();
            }
        )(req, res, next);
    };
}

module.exports = { authenticateLogin };
