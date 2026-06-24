//src/routes/userRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  updateEmail,
  updatePassword,
  deleteMyAccount,
  updateNotificationPreference
} = require("../controllers/userController");

router.patch("/me/email", authMiddleware, updateEmail);

router.patch("/me/password", authMiddleware, updatePassword);

router.patch("/me/notifications", authMiddleware, updateNotificationPreference
);

router.delete("/me", authMiddleware, deleteMyAccount);

module.exports = router;