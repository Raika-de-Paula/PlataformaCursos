//src/routes/instructorRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const validateMiddleware = require(
  "../middlewares/validateMiddleware"
);

const {
  getMyInstructorProfile,
  createOrUpdateInstructorProfile,
  getPublicInstructorProfile
} = require("../controllers/instructorController");

router.get(
  "/me",
  authMiddleware,
  getMyInstructorProfile
);

router.get(
  "/:userId", 
  getPublicInstructorProfile);

router.patch(
  "/me",
  authMiddleware,
  upload.single("photo"),
  createOrUpdateInstructorProfile
);

module.exports = router;