const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        logging: false,
    }
);

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tokenHash: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "users",
        createdAt: false,
        updatedAt: false,
    }
);

User.sync({ alter: true, force: false });

class UserRepository {
    async findUserByEmail(userEmail) {
        const data = await User.findOne({
            where: {
                email: {
                    [Op.eq]: userEmail,
                },
            },
        });
        //console.log(data);
        const userDB = data.dataValues;

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        return userDB;
    }

    async findUserByPhone(userPhone) {
        const data = await User.findAll({
            where: {
                phone: {
                    [Op.eq]: userPhone,
                },
            },
        });
        const userDB = data[0].dataValues;

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        return userDB;
    }

    async getUserById(userId) {
        const data = await User.findAll({
            where: {
                id: {
                    [Op.eq]: userId,
                },
            },
        });
        const userDB = data[0].dataValues;

        if (!userDB) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        return [userDB];
    }

    async findMaxUserId() {
        const maxId = await User.max("id");

        return Number(maxId);
    }

    async saveNewUser(newUser) {
        await User.create(newUser);
    }

    async updateTokenHashById(userId, newTokenHash) {
        const result = await User.update(
            { tokenHash: newTokenHash },
            {
                where: {
                    id: {
                        [Op.eq]: userId,
                    },
                },
            }
        );

        if (!result) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }

    async updateTokenHashByEmail(userEmail, newTokenHash) {
        const result = await User.update(
            { tokenHash: newTokenHash },
            {
                where: {
                    email: {
                        [Op.eq]: userEmail,
                    },
                },
            }
        );

        if (!result) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }

    async updateTokenHashByPhone(userPhone, newTokenHash) {
        const result = await User.update(
            { tokenHash: newTokenHash },
            {
                where: {
                    phone: {
                        [Op.eq]: userPhone,
                    },
                },
            }
        );

        if (!result) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }
}

module.exports = { userRepository: new UserRepository() };
