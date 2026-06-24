//src/controllers/enrollmentController.js

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const StudentProfile = require("../models/StudentProfile");

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Aluno já está matriculado neste curso"
      });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId
    });

    await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $addToSet: {
          enrolledCourses: courseId
        }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Matrícula realizada com sucesso",
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user.id
    })
      .populate({
        path: "courseId",
        populate: {
          path: "instructorId",
          select: "name email"
        }
      });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments
};