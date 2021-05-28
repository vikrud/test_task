const { fileDBRepository } = require("./file.database.repository");
const { fileSystemRepository } = require("./file.system.repository");
const { fileDestFolder } = require("../../constants");

class FileService {
    async uploadFileParams(fileParams) {
        const newFileId = (await fileDBRepository.findMaxFileId()) + 1;
        const fileParamsWIthId = {};
        Object.assign(fileParamsWIthId, fileParams, { id: newFileId });

        await fileDBRepository.uploadFileParams(fileParamsWIthId);

        return newFileId;
    }

    async getFileList(listSize, page) {
        const fileList = await fileDBRepository.getFileList(listSize, page);

        return fileList;
    }

    async deleteFIle(fileId) {
        const filePathAndName = await fileDBRepository.getFilePathAndName(
            fileId
        );
        const filePath = `${fileDestFolder}/${filePathAndName.fileName}`;

        await fileSystemRepository.deleteFileFromFS(filePath);
        await fileDBRepository.deleteFileParams(fileId);
    }

    async getOneFileInfo(fileId) {
        const fileInfo = await fileDBRepository.getOneFileInfo(fileId);

        return fileInfo;
    }

    async getFilePathAndName(fileId) {
        const filePathAndName = await fileDBRepository.getFilePathAndName(
            fileId
        );
        const filePath = `${fileDestFolder}/${filePathAndName.fileName}`;
        const fileName = filePathAndName.originalName;

        return [filePath, fileName];
    }

    async updateFile(fileId, fileParams) {
        const filePathAndName = await fileDBRepository.getFilePathAndName(
            fileId
        );
        const fileOldPath = `${fileDestFolder}/${filePathAndName.fileName}`;

        await fileSystemRepository.deleteFileFromFS(fileOldPath);
        await fileDBRepository.updateFileParams(fileId, fileParams);
    }
}

module.exports = { fileService: new FileService() };
