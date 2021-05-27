const mysql = require("mysql2");
const { CustomError } = require("../../errorHandler");

const mysql_config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
};

const pool = mysql.createPool(mysql_config);
const promisePool = pool.promise();

class UserRepository {
    async findUserByEmail(userEmail) {
        const query =
            "SELECT id, name, surname, email, phone, password, tokenHash FROM users WHERE email=?";
        const [rows] = await promisePool.query(query, userEmail);

        const userDB = rows[0];

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        return userDB;
    }

    async findUserByPhone(userPhone) {
        const query =
            "SELECT id, name, surname, email, phone, password, tokenHash FROM users WHERE phone=?";
        const [rows] = await promisePool.query(query, userPhone);

        const userDB = rows[0];

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        return userDB;
    }

    async getUserById(userId) {
        const query =
            "SELECT id, name, surname, email, phone, password, tokenHash FROM users WHERE id=?";
        const [rows] = await promisePool.query(query, userId);
        const userDB = rows[0];

        if (!userDB) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        return [userDB];
    }

    async findMaxUserId() {
        const query = "SELECT MAX(id) AS MAX_ID FROM users";
        const [rows] = await promisePool.query(query);
        const maxId = rows[0].MAX_ID;

        return maxId;
    }

    async saveNewUser(newUser) {
        const query = "INSERT INTO users SET ?";
        await promisePool.query(query, newUser);
    }

    async updateTokenHashById(userId, newTokenHash) {
        const query = "UPDATE users SET tokenHash=? WHERE id=?";
        const [rows] = await promisePool.query(query, [newTokenHash, userId]);

        if (!rows.affectedRows) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }

    async updateTokenHashByEmail(userEmail, newTokenHash) {
        const query = "UPDATE users SET tokenHash=? WHERE email=?";
        const [rows] = await promisePool.query(query, [
            newTokenHash,
            userEmail,
        ]);

        if (!rows.affectedRows) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }

    async updateTokenHashByPhone(userPhone, newTokenHash) {
        const query = "UPDATE users SET tokenHash=? WHERE phone=?";
        const [rows] = await promisePool.query(query, [
            newTokenHash,
            userPhone,
        ]);

        if (!rows.affectedRows) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }
}

module.exports = { userRepository: new UserRepository() };
