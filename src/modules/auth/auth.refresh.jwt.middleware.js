const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { CustomError } = require("../../error.handler");
const { refreshJwtValidTime } = require("../../constants");

const refreshJwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_PRIVATE_KEY,
    },
    function (payload, done) {
        const tokenAge = Math.floor(Date.now() / 1000) - payload.iat;

        if (
            payload.id &&
            payload.sub === "refresh" &&
            tokenAge < refreshJwtValidTime
        ) {
            return done(null, payload);
        } else {
            return done(null, false);
        }
    }
);

function authenticateRefreshJWT() {
    return function (req, res, next) {
        passport.authenticate(
            refreshJwtStrategy,
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

module.exports = { authenticateRefreshJWT };
