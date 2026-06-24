//src/middlewares/courseOwnerMiddleware.js

const Course = require("../models/Course");

const courseOwnerMiddleware = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Você não é o proprietário deste curso"
      });
    }

    req.course = course;

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = courseOwnerMiddleware;