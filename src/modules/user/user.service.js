const { userRepository } = require("./user.repository");
const { encodeAccessJWT, encodeRefreshJWT } = require("../auth/jwt.config");
const { CustomError } = require("../../error.handler");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../../constants");

class UserService {
    async userSignIn(idEmailOrPhone, password) {
        //since the id parameter (idEmailOrPhone in the userSignIn method) can contain an email or a phone number,
        //added additional checks and additional methods in userRepository for each of the possible data
        const validEmailRegExp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let userDB;

        const newTokenHash = await bcrypt.hash(
            `${idEmailOrPhone}_${Date.now()}`,
            saltRounds
        );

        const isIdEmail = validEmailRegExp.test(idEmailOrPhone);

        if (isIdEmail) {
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

    async getNewBearerToken(userId) {
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

        const accessToken = await encodeAccessJWT(newUserComplete);
        const refreshToken = await encodeRefreshJWT(newUserComplete);

        return { bearerToken: accessToken, refreshToken: refreshToken };
    }

    async updateUserTokenHash(userId) {
        const newTokenHash = await bcrypt.hash(
            `${userId}_${Date.now() / 1000}`,
            saltRounds
        );
        await userRepository.updateTokenHashById(userId, newTokenHash);
    }
}

module.exports = { userService: new UserService() };
