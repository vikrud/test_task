const { fileRepository } = require("./file.repository");
const { fileDestFolder } = require("../../constants");

class FileService {
    async uploadFileParams(fileParams) {
        const newFileId = (await fileRepository.findMaxFileId()) + 1;
        const fileParamsWIthId = {};
        Object.assign(fileParamsWIthId, fileParams, { id: newFileId });

        await fileRepository.uploadFileParams(fileParamsWIthId);
    }

    async getFileList(listSize, page) {
        const fileList = await fileRepository.getFileList(listSize, page);

        return fileList;
    }

    async deleteFIle(fileId) {
        const filePathAndName = await fileRepository.getFilePathAndName(fileId);
        const filePath = `${fileDestFolder}/${filePathAndName.fileName}`;

        await fileRepository.deleteFIleFromFS(filePath);
        await fileRepository.deleteFIleFromDB(fileId);
    }

    async getOneFileInfo(fileId) {
        const fileInfo = await fileRepository.getOneFileInfo(fileId);

        return fileInfo;
    }

    async downloadFile(fileId) {
        const filePathAndName = await fileRepository.getFilePathAndName(fileId);
        const filePath = `${fileDestFolder}/${filePathAndName.fileName}`;
        const fileName = filePathAndName.originalName;

        return [filePath, fileName];
    }

    async updateFile(fileId, fileParams) {
        const filePathAndName = await fileRepository.getFilePathAndName(fileId);
        const fileOldPath = `${fileDestFolder}/${filePathAndName.fileName}`;

        await fileRepository.deleteFIleFromFS(fileOldPath);
        await fileRepository.updateFileParams(fileId, fileParams);
    }
}

module.exports = { fileService: new FileService() };
