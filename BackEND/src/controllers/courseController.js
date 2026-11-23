// src/controllers/courseController.js

const Course = require("../models/Course");
const InstructorProfile = require("../models/InstructorProfile");
const Enrollment = require("../models/Enrollment");
const Notification = require("../models/Notification");
const User = require("../models/User");

const detectMaterialType = (mimetype = "") => {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("zip") || mimetype.includes("compressed")) return "zip";
  if (
    mimetype.includes("word") ||
    mimetype.includes("document") ||
    mimetype.includes("presentation") ||
    mimetype.includes("spreadsheet")
  ) {
    return "document";
  }
  return "link";
};

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
    const course = await Course.findById(req.params.courseId).populate(
      "instructorId",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    let isEnrolled = false;
    let isOwner = false;

    if (req.user) {
      if (course.instructorId) {
        const instructorIdStr =
          course.instructorId?._id?.toString() || course.instructorId.toString();
        isOwner = instructorIdStr === req.user.id;
      }

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
        updatedAt: course.updatedAt,
        sections: course.sections.map((section) => ({
          _id: section._id,
          title: section.title,
          order: section.order,
          contents: section.contents.map((content) => ({
            _id: content._id,
            title: content.title,
            type: content.type,
            order: content.order
          }))
        })),
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

    const uploadedFiles = req.files || [];
    const materials = uploadedFiles.map((file) => ({
      url: file.path,
      publicId: file.filename || "",
      name: file.originalname || "",
      size: file.size || 0,
      type: detectMaterialType(file.mimetype)
    }));

    const firstMaterial = materials[0];

    section.contents.push({
      title,
      description,
      type: firstMaterial ? firstMaterial.type : type || "text",
      order,
      materials,
      materialUrl: firstMaterial?.url || "",
      publicId: firstMaterial?.publicId || "",
      materialName: firstMaterial?.name || "",
      materialSize: firstMaterial?.size || 0
    });

    await course.save();

    const createdContent = section.contents[section.contents.length - 1];

    const enrollments = await Enrollment.find({
      courseId: course._id
    }).populate("studentId", "notificationsEnabled");

    const studentsToNotify = enrollments.filter(
      (enrollment) =>
        enrollment.studentId &&
        enrollment.studentId.notificationsEnabled !== false
    );

    if (studentsToNotify.length > 0) {
      await Notification.insertMany(
        studentsToNotify.map((enrollment) => ({
          userId: enrollment.studentId._id,
          type: "new_content",
          title: "Novo conteúdo publicado",
          message: `O material "${createdContent.title}" foi publicado no curso "${course.title}".`,
          link: `/courses/${course._id}?contentId=${createdContent._id}`
        }))
      );
    }

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
    const allowedStatus = ["in_progress", "finished"];

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
    const { title, description, order } = req.body;

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

    if ((!content.materials || content.materials.length === 0) && content.materialUrl) {
      content.materials.push({
        url: content.materialUrl,
        publicId: content.publicId || "",
        name: content.materialName || "Material",
        size: content.materialSize || 0,
        type: content.type && content.type !== "text" ? content.type : "link"
      });
    }

    const uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        content.materials.push({
          url: file.path,
          publicId: file.filename || "",
          name: file.originalname || "",
          size: file.size || 0,
          type: detectMaterialType(file.mimetype)
        });
      });

      const first = content.materials[0];
      content.type = first.type;
      content.materialUrl = first.url;
      content.publicId = first.publicId;
      content.materialName = first.name;
      content.materialSize = first.size;
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
    const { sectionId, contentId, materialId } = req.params;
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

    if (materialId === "legacy") {
      content.materialUrl = "";
      content.publicId = "";
      content.type = "text";
      content.materialName = "";
      content.materialSize = 0;
    } else {
      content.materials = content.materials.filter(
        (mat) => mat._id.toString() !== materialId
      );

      if (content.materials.length > 0) {
        const first = content.materials[0];
        content.materialUrl = first.url;
        content.publicId = first.publicId;
        content.materialName = first.name;
        content.materialSize = first.size;
        content.type = first.type;
      } else {
        content.materialUrl = "";
        content.publicId = "";
        content.materialName = "";
        content.materialSize = 0;
        content.type = "text";
      }
    }

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