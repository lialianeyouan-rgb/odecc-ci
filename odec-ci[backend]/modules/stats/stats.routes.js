const { Router } = require("express");
const { getStats } = require("./stats.controller.js");
const { protect } = require("../../middlewares/authMiddleware.js");

const r = Router();
r.get("/", protect, getStats);
module.exports = r;
