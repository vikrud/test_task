require("dotenv").config();
const express = require("express");
const app = express();
const user = require("./modules/user/user.controller");
const file = require("./modules/file/file.controller");
const cors = require("cors");

const corsOptions = {
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.listen(3000);
app.use(cors(corsOptions));
app.use("/", user);
app.use("/file", file);
