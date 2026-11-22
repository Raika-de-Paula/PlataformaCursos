//src/middlewares/commentPermissionMiddleware.js

const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const commentPermissionMiddleware = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    const isCourseOwner =
      course.instructorId.toString() === req.user.id;

    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId
    });

    const isEnrolledStudent = !!enrollment;

    if (!isCourseOwner && !isEnrolledStudent) {
      return res.status(403).json({
        message: "Você não tem permissão para comentar neste conteúdo"
      });
    }

    req.course = course;

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = commentPermissionMiddleware;