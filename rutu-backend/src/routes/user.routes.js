const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");

// Import middleware dan schema validation
const validate = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validations/user.validation");

router.get("/:id", userController.getProfile);
router.get("/:id/dashboard", userController.getDashboardStats);

// Terapkan validasi di rute update
router.put(
  "/:id",
  upload.single("profilePicture"),
  validate(updateProfileSchema),
  userController.updateProfile,
);

module.exports = router;
