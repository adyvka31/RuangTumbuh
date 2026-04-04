const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const { authLimiter } = require("../middlewares/rateLimit.middleware");

// Sisipkan authLimiter sebelum controller dieksekusi
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

module.exports = router;
