const saltRounds = 10;
const bearerJwtValidTime = 60 * 10;
const refreshJwtValidTime = 24 * 60 * 60;
const fileDestFolder = "file-storage";

module.exports = {
    saltRounds,
    bearerJwtValidTime,
    refreshJwtValidTime,
    fileDestFolder,
};
