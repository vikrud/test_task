const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { CustomError } = require("../../errorHandler");
const { bearerJwtValidTime } = require("../../constants");
const { userService } = require("../user/user.service");

const bearerJwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_PRIVATE_KEY,
    },
    async function (payload, done) {
        const tokenAge = Math.floor(Date.now() / 1000) - payload.iat;
        const userDB = await userService.getUserById(payload.id);
        const tokenHashDB = userDB[0].tokenHash;

        if (
            payload.id &&
            payload.sub === "access" &&
            tokenAge < bearerJwtValidTime &&
            tokenHashDB === payload.tokenHash
        ) {
            return done(null, payload);
        } else {
            return done(null, false);
        }
    }
);

function authenticateBearerJWT() {
    return function (req, res, next) {
        passport.authenticate(
            bearerJwtStrategy,
            { session: false },
            (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    return next(new CustomError("UNAUTHORISED"));
                }

                req.user = user;
                next();
            }
        )(req, res, next);
    };
}

module.exports = { authenticateBearerJWT };
