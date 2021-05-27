const jwt = require("jsonwebtoken");
const { bearerJwtValidTime, refreshJwtValidTime } = require("../../constants");

async function encodeAccessJWT(userDB) {
    let payload = {
        id: userDB.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + bearerJwtValidTime,
        sub: "access",
        tokenHash: userDB.tokenHash,
    };

    const accessJWT = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        algorithm: "HS256",
    });

    return accessJWT;
}

async function encodeRefreshJWT(userDB) {
    let payload = {
        id: userDB.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + refreshJwtValidTime,
        sub: "refresh",
        tokenHash: userDB.tokenHash,
    };

    const refreshJWT = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        algorithm: "HS256",
    });

    return refreshJWT;
}

module.exports = { encodeAccessJWT, encodeRefreshJWT };
