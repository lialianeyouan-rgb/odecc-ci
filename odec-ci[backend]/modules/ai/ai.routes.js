const { Router } = require("express");
const { generate } = require("./ai.controller.js");
const { aiLimiter } = require("../../middlewares/routeLimiters.js");
const r = Router();
r.post("/", aiLimiter, generate);
module.exports = r;
