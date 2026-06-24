// src/controllers/courseController.js

const Course = require("../models/Course");
const InstructorProfile = require("../models/InstructorProfile");
const Enrollment = require("../models/Enrollment");
const Notification = require("../models/Notification");
const User = require("../models/User");

const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const course = await Course.create({
      instructorId: req.user.id,
      title,
      description,
      category,
      status: "in_progress"
    });

    await InstructorProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $addToSet: {
          courses: course._id
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(201).json({
      message: "Curso criado com sucesso",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructorId",
      "name email"
    );

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    let isEnrolled = false;
    let isOwner = false;

    if (req.user) {
      isOwner = course.instructorId.toString() === req.user.id;

      const enrollment = await Enrollment.findOne({
        studentId: req.user.id,
        courseId: course._id
      });

      isEnrolled = !!enrollment;
    }

    if (!isEnrolled && !isOwner) {
      return res.json({
        _id: course._id,
        instructorId: course.instructorId,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        status: course.status,
        isEnrolled: false
      });
    }

    res.json({
      ...course.toObject(),
      isEnrolled: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createSection = async (req, res) => {
  try {
    const { title, order } = req.body;
    const course = req.course;

    course.sections.push({
      title,
      order,
      contents: []
    });

    await course.save();

    res.status(201).json({
      message: "Sessão criada com sucesso",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createContent = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, description, type, order } = req.body;
    const course = req.course;

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    section.contents.push({
      title,
      description,
      type: type || "text",
      order,
      materialUrl: req.file?.path || "",
      publicId: req.file?.filename || "",
      materialName: req.file?.originalname || "",
      materialSize: req.file?.size || 0
    });

    await course.save();

    const enrollments = await Enrollment.find({
      courseId: course._id
    }).populate("studentId", "notificationsEnabled");

    const studentsToNotify = enrollments.filter(
      (enrollment) =>
        enrollment.studentId?.notificationsEnabled !== false
    );

    await Notification.insertMany(
      studentsToNotify.map((enrollment) => ({
        userId: enrollment.studentId._id,
        type: "new_content",
        title: "Novo conteúdo publicado",
        message: `Um novo conteúdo foi publicado no curso "${course.title}".`,
        link: `/courses/${course._id}`
      }))
    );

    res.status(201).json({
      message: "Conteúdo criado com sucesso",
      course 
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (title !== undefined) req.course.title = title;
    if (description !== undefined) req.course.description = description;
    if (category !== undefined) req.course.category = category;
    if (status !== undefined) req.course.status = status;

    if (req.file) {
      req.course.thumbnail = req.file.path;
      content.materialUrl = req.file.path;
      content.publicId = req.file.filename;
      content.materialName = req.file.originalname;
      content.materialSize = req.file.size;

      if (type !== undefined && type !== "") {
        content.type = type;
      }
    }

    await req.course.save();

    res.json({
      message: "Curso atualizado com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["Andamento", "Finalizado"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status inválido"
      });
    }

    req.course.status = status;
    await req.course.save();

    res.json({
      message: "Status do curso updated com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    await req.course.deleteOne();

    await InstructorProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $pull: {
          courses: courseId
        }
      }
    );

    res.json({
      message: "Curso deletado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMyInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructorId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, order } = req.body;

    const section = req.course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    if (title !== undefined) section.title = title;
    if (order !== undefined) section.order = order;

    await req.course.save();

    res.json({
      message: "Sessão atualizada com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = req.course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    section.deleteOne();
    await req.course.save();

    res.json({
      message: "Sessão deletada com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const { sectionId, contentId } = req.params;
    const { title, description, type, order } = req.body;

    const section = req.course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    const content = section.contents.id(contentId);

    if (!content) {
      return res.status(404).json({
        message: "Conteúdo não encontrado"
      });
    }

    if (title !== undefined) content.title = title;
    if (description !== undefined) content.description = description;
    if (order !== undefined) content.order = order;

    if (type !== undefined && type !== "" && type !== "text") {
      content.type = type;
    }

    if (req.file) {
      content.materialUrl = req.file.path;
      content.publicId = req.file.filename;
      
      if (type !== undefined && type !== "") {
        content.type = type;
      }
    }

    await req.course.save();

    res.json({
      message: "Conteúdo atualizado com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { sectionId, contentId } = req.params;
    const section = req.course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    const content = section.contents.id(contentId);

    if (!content) {
      return res.status(404).json({
        message: "Conteúdo não encontrado"
      });
    }

    content.deleteOne();
    await req.course.save();

    res.json({
      message: "Conteúdo deletado com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeContentMaterial = async (req, res) => {
  try {
    const { sectionId, contentId } = req.params;
    const section = req.course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Sessão não encontrada"
      });
    }

    const content = section.contents.id(contentId);

    if (!content) {
      return res.status(404).json({
        message: "Conteúdo não encontrado"
      });
    }

    content.materialUrl = "";
    content.publicId = "";
    content.type = "text";
    content.materialName = "";
    content.materialSize = 0;

    await req.course.save();

    res.json({
      message: "Material removido com sucesso",
      course: req.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  createSection,
  createContent,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  getMyInstructorCourses,
  updateSection,
  deleteSection,
  updateContent,
  deleteContent,
  removeContentMaterial
};