//src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getMyNotifications);

router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  authMiddleware,
  deleteNotification
);

module.exports = router;