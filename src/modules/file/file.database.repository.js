const { Sequelize, DataTypes, Op } = require("sequelize");
const { CustomError } = require("../../error.handler");

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

const File = sequelize.define(
    "File",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        originalName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extension: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        mimetype: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        uploadDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "files",
        createdAt: false,
        updatedAt: false,
    }
);

File.sync({ alter: true, force: false });

class FileDBRepository {
    async findMaxFileId() {
        const maxId = (await File.max("id")) || 0;

        return maxId;
    }

    async uploadFileParams(fileParams) {
        await File.create(fileParams);
    }

    async getFileList(listSize, page) {
        const offsetFiles = (page - 1) * listSize;
        const fileList = await File.findAll({
            attributes: [
                "id",
                "originalName",
                "extension",
                "mimetype",
                "size",
                "uploadDate",
            ],
            offset: offsetFiles,
            limit: listSize,
            raw: true,
        });

        return fileList;
    }

    async getOneFileInfo(fileId) {
        const fileInfo = await File.findOne({
            attributes: [
                "id",
                "originalName",
                "extension",
                "mimetype",
                "size",
                "uploadDate",
            ],
            where: {
                id: {
                    [Op.eq]: fileId,
                },
            },
            raw: true,
        });

        if (!fileInfo) {
            throw new CustomError("CANT_FIND_FILE_BY_ID");
        }

        return fileInfo;
    }

    async getFilePathAndName(fileId) {
        const filePathAndName = await File.findOne({
            attributes: ["id", "fileName", "originalName"],
            where: {
                id: {
                    [Op.eq]: fileId,
                },
            },
            raw: true,
        });

        if (!filePathAndName) {
            throw new CustomError("CANT_FIND_FILE_BY_ID");
        }

        return filePathAndName;
    }

    async deleteFileParams(fileId) {
        const result = await File.destroy({
            where: {
                id: {
                    [Op.eq]: fileId,
                },
            },
            raw: true,
        });

        if (!result) {
            throw new CustomError("CANT_FIND_FILE_BY_ID");
        }
    }

    async updateFileParams(fileId, fileParams) {
        const result = await File.update(fileParams, {
            where: {
                id: {
                    [Op.eq]: fileId,
                },
            },
            raw: true,
        });

        if (!result) {
            throw new CustomError("CANT_FIND_FILE_BY_ID");
        }
    }
}

module.exports = { fileDBRepository: new FileDBRepository() };
