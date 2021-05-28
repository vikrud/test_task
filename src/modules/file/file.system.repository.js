const fsPromises = require("fs").promises;

class FileSystemRepository {
    async deleteFileFromFS(filePath) {
        await fsPromises.unlink(filePath);
    }
}

module.exports = { fileSystemRepository: new FileSystemRepository() };
