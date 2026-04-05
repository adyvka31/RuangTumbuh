const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");

// GET /api/users/:id
router.get("/:id", userController.getProfile); 

// PUT /api/users/:id
router.put("/:id", upload.single("avatar"), userController.updateProfile); 

// GET /api/users/:id/dashboard-stats
router.get("/:id/dashboard-stats", userController.getDashboardStats);

module.exports = router;