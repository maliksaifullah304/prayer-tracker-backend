const express = require("express");
const router = express.Router();
const auth = require("./auth");
const { authenticateUser } = require("../middleware/authMiddleware");

router.use("/auth", auth);

module.exports = router;
