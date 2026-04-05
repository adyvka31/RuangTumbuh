const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Import middleware dan schema validation
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

// Sisipkan `validate(schema)` sebelum `controller`
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
