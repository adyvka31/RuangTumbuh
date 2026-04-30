const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { loginPayloadSchema, registerPayloadSchema } = require("@rutu/shared");

// Custom middleware khusus untuk mengatasi isu Zod Multiple Instances
const validateSharedBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    let errorMessage = "Validasi gagal";
    if (err.errors) {
      errorMessage = err.errors.map((e) => e.message).join(", ");
    }
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

router.post(
  "/register",
  validateSharedBody(registerPayloadSchema),
  authController.register,
);
router.post(
  "/login",
  validateSharedBody(loginPayloadSchema),
  authController.login,
);

module.exports = router;
