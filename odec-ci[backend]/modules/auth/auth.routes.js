const { Router } = require("express");
const { login } = require("./auth.controller.js");
const { authLimiter } = require("../../middlewares/routeLimiters.js");

const r = Router();
r.post("/login", authLimiter, login);
module.exports = r;
