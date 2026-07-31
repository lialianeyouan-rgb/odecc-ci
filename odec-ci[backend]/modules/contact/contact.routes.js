const { Router } = require("express");
const { sendMail } = require("./contact.controller.js");
const { contactLimiter } = require("../../middlewares/routeLimiters.js");

const r = Router();
r.post("/", contactLimiter, sendMail);
module.exports = r;
