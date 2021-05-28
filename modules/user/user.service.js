const { userRepository } = require("./user.repository");
const { encodeAccessJWT, encodeRefreshJWT } = require("../auth/jwt.config");
const { CustomError } = require("../../errorHandler");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../../constants");

class UserService {
    async userSignIn(idEmailOrPhone, password) {
        const validEmailRegExp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let userDB;

        const newTokenHash = await bcrypt.hash(
            `${idEmailOrPhone}_${Date.now()}`,
            saltRounds
        );

        if (validEmailRegExp.test(idEmailOrPhone)) {
            await userRepository.updateTokenHashByEmail(
                idEmailOrPhone,
                newTokenHash
            );
            userDB = await userRepository.findUserByEmail(idEmailOrPhone);
        } else {
            await userRepository.updateTokenHashByEmail(
                idEmailOrPhone,
                newTokenHash
            );
            userDB = await userRepository.findUserByPhone(idEmailOrPhone);
        }

        const matchLoginPass = await bcrypt.compare(password, userDB.password);

        if (!matchLoginPass) {
            throw new CustomError("PASSWORD_IS_INCORRECT");
        }

        const accessToken = await encodeAccessJWT(userDB);
        const refreshToken = await encodeRefreshJWT(userDB);

        return { bearerToken: accessToken, refreshToken: refreshToken };
    }

    async userSignInNewToken(userId) {
        await this.userLogout(userId);

        const userDB = await userRepository.getUserById(userId);

        const accessToken = await encodeAccessJWT(userDB);

        return { bearerToken: accessToken };
    }

    async getUserById(userId) {
        const userDB = await userRepository.getUserById(userId);
        return userDB;
    }

    async createUser(newUser) {
        const newUserId = (await userRepository.findMaxUserId()) + 1;
        const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
        const newTokenHash = await bcrypt.hash(
            `${newUser.id}_${Date.now()}`,
            saltRounds
        );
        const newUserComplete = {};
        Object.assign(newUserComplete, newUser, {
            id: newUserId,
            password: passwordHash,
            tokenHash: newTokenHash,
        });

        await userRepository.saveNewUser(newUserComplete);
    }

    async userLogout(userId) {
        const newTokenHash = await bcrypt.hash(
            `${userId}_${Date.now() / 1000}`,
            saltRounds
        );
        await userRepository.updateTokenHashById(userId, newTokenHash);
    }
}

module.exports = { userService: new UserService() };
