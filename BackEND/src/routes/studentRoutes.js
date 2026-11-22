//src/routes/studentRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const validateMiddleware = require(
  "../middlewares/validateMiddleware"
);

const {
  profileValidator
} = require("../validators/profileValidator");

const {
  getMyStudentProfile,
  createOrUpdateStudentProfile,
  getPublicStudentProfile
} = require("../controllers/studentController");

router.get(
  "/me",
  authMiddleware,
  getMyStudentProfile
);

router.get(
  "/:userId", 
  getPublicStudentProfile
);

router.patch(
  "/me",
  authMiddleware,
  upload.single("photo"),
  createOrUpdateStudentProfile
);

module.exports = router;