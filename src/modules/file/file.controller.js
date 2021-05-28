const express = require("express");
const router = express.Router();
const { authenticateBearerJWT } = require("../auth/auth.bearer.jwt.middleware");
const { MessageToUser } = require("../../message.to.user");
const { errorHandler } = require("../../error.handler");
const { fileService } = require("./file.service");
const multer = require("multer");
const { fileDestFolder } = require("../../constants");
const upload = multer({ dest: fileDestFolder });
const { insertDataIntoResponseObj } = require("../../utils");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function getFileParamsFromReq(reqFile) {
    const extension = reqFile.originalname.match(/\.[0-9a-z]+$/i)[0].slice(1);

    const fileParamsToDB = {
        originalName: reqFile.originalname,
        fileName: reqFile.filename,
        extension: extension,
        mimetype: reqFile.mimetype,
        size: reqFile.size,
        uploadDate: Date.now(),
    };

    return fileParamsToDB;
}

router.post(
    "/upload",
    authenticateBearerJWT(),
    upload.single("filedata"),
    async function (req, res, next) {
        try {
            const fileParamsToDB = await getFileParamsFromReq(req.file);

            const newFileId = await fileService.uploadFileParams(
                fileParamsToDB
            );

            const responseData = await insertDataIntoResponseObj(
                new MessageToUser("FILE_UPLOADED_MESSAGE", newFileId)
            );

            res.status(201).send(responseData);
        } catch (err) {
            next(err);
        }
    }
);

router.get("/list", authenticateBearerJWT(), async function (req, res, next) {
    try {
        const query = req.query;

        const listSize = +query.list_size || 10;
        const page = +query.page || 1;

        const fileList = await fileService.getFileList(listSize, page);

        const responseData = await insertDataIntoResponseObj(fileList);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.delete(
    "/delete/:id",
    authenticateBearerJWT(),
    async function (req, res, next) {
        try {
            const id = req.params.id;

            await fileService.deleteFIle(id);

            const responseData = await insertDataIntoResponseObj(
                new MessageToUser("FILE_DELETED_MESSAGE")
            );

            res.status(200).send(responseData);
        } catch (err) {
            next(err);
        }
    }
);

router.get("/:id", authenticateBearerJWT(), async function (req, res, next) {
    try {
        const fileId = req.params.id;

        const fileInfo = await fileService.getOneFileInfo(fileId);

        const responseData = await insertDataIntoResponseObj([fileInfo]);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get(
    "/download/:id",
    authenticateBearerJWT(),
    async function (req, res, next) {
        try {
            const id = req.params.id;

            const [filePath, fileName] = await fileService.downloadFile(id);

            res.download(filePath, fileName);
        } catch (err) {
            next(err);
        }
    }
);

router.put(
    "/update/:id",
    authenticateBearerJWT(),
    upload.single("filedata"),
    async function (req, res, next) {
        try {
            const id = req.params.id;

            const fileNewParams = await getFileParamsFromReq(req.file);

            await fileService.updateFile(id, fileNewParams);

            const responseData = await insertDataIntoResponseObj(
                new MessageToUser("FILE_UPDATED_MESSAGE")
            );

            res.status(200).send(responseData);
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
