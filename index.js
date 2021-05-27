const express = require("express");
const app = express();
const user = require("./modules/user/user.controller");
const file = require("./modules/file/file.controller");

app.listen(3000);
app.use("/", user);
app.use("/file", file);
