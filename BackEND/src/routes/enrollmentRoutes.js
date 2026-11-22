const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  enrollInCourse,
  getMyEnrollments
} = require("../controllers/enrollmentController");

router.post(
  "/courses/:courseId/enroll",
  authMiddleware,
  roleMiddleware("student"),
  enrollInCourse
);

router.get(
  "/students/me/enrollments",
  authMiddleware,
  roleMiddleware("student"),
  getMyEnrollments
);

module.exports = router;