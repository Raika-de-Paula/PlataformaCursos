//src/routes/courseRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const courseOwnerMiddleware = require("../middlewares/courseOwnerMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  createCourse,
  getCourses,
  getCourseById,
  createSection,
  createContent,
  updateSection,
  deleteSection,
  updateContent,
  deleteContent,
  removeContentMaterial,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  getMyInstructorCourses
} = require("../controllers/courseController");

const {
  createCourseValidator
} = require("../validators/courseValidator");

const validateMiddleware = require("../middlewares/validateMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createCourseValidator,
  validateMiddleware,
  createCourse
);
router.get("/", getCourses);

router.get(
  "/instructor/me",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyInstructorCourses
);

router.get(
  "/:courseId",
  authMiddleware,
  getCourseById
);

router.post(
  "/:courseId/sections",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  createSection
);

router.post(
  "/:courseId/sections/:sectionId/contents",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  upload.single("material"),
  createContent
);

router.patch(
  "/:courseId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  upload.single("thumbnail"),
  updateCourse
);

router.delete(
  "/:courseId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  deleteCourse
);

router.patch(
  "/:courseId/status",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  updateCourseStatus
);

router.patch(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  updateSection
);

router.delete(
  "/:courseId/sections/:sectionId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  deleteSection
);

router.patch(
  "/:courseId/sections/:sectionId/contents/:contentId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  upload.single("material"),
  updateContent
);

router.delete(
  "/:courseId/sections/:sectionId/contents/:contentId",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  deleteContent
);

router.delete(
  "/:courseId/sections/:sectionId/contents/:contentId/material",
  authMiddleware,
  roleMiddleware("instructor"),
  courseOwnerMiddleware,
  removeContentMaterial
);

module.exports = router;