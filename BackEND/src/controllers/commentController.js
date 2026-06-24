//src/controllers/commentController.js

const Comment = require("../models/Comment");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const InstructorProfile = require("../models/InstructorProfile");

const createComment = async (req, res) => {
  try {
    const { courseId, sectionId, contentId } = req.params;
    const { text } = req.body;

    const course = req.course;

    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Sessão não encontrada" });
    }

    const content = section.contents.id(contentId);

    if (!content) {
      return res.status(404).json({ message: "Conteúdo não encontrado" });
    }

    const comment = await Comment.create({
      courseId,
      sectionId,
      contentId,
      userId: req.user.id,
      text
    });

    const isInstructorCommenting =
      course.instructorId.toString() === req.user.id;

    if (!isInstructorCommenting) {
      const instructor = await User.findById(course.instructorId).select(
        "notificationsEnabled"
      );

      if (instructor?.notificationsEnabled !== false) {
        await Notification.create({
          userId: course.instructorId,
          type: "new_comment",
          title: "Novo comentário no seu curso",
          message: `Alguém comentou no conteúdo "${content.title}" do curso "${course.title}".`,
          link: `/courses/${course._id}`
        });
      }
    }

    res.status(201).json({
      message: "Comentário criado com sucesso",
      comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContentComments = async (req, res) => {
  try {
    const { contentId } = req.params;

    const comments = await Comment.find({ contentId })
      .populate("userId", "name email roles")
      .populate("replies.userId", "name email roles")
      .sort({ createdAt: -1 });

    const userIds = [];

    comments.forEach((comment) => {
      if (comment.userId?._id) {
        userIds.push(comment.userId._id.toString());
      }

      comment.replies.forEach((reply) => {
        if (reply.userId?._id) {
          userIds.push(reply.userId._id.toString());
        }
      });
    });

    const uniqueUserIds = [...new Set(userIds)];

    const studentProfiles = await StudentProfile.find({
      userId: { $in: uniqueUserIds }
    }).select("userId photoUrl");

    const instructorProfiles = await InstructorProfile.find({
      userId: { $in: uniqueUserIds }
    }).select("userId photoUrl");

    const photoMap = {};

    studentProfiles.forEach((profile) => {
      photoMap[profile.userId.toString()] = profile.photoUrl;
    });

    instructorProfiles.forEach((profile) => {
      if (profile.photoUrl) {
        photoMap[profile.userId.toString()] = profile.photoUrl;
      }
    });

    const commentsWithPhotos = comments.map((comment) => {
      const commentObject = comment.toObject();

      const commentUserId = commentObject.userId?._id?.toString();

      commentObject.userId.photoUrl = photoMap[commentUserId] || "";

      commentObject.replies = commentObject.replies.map((reply) => {
        const replyUserId = reply.userId?._id?.toString();

        reply.userId.photoUrl = photoMap[replyUserId] || "";

        return reply;
      });

      return commentObject;
    });

    res.json(commentsWithPhotos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        userId: req.user.id
      },
      { text },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comentário não encontrado ou sem permissão"
      });
    }

    res.json({
      message: "Comentário atualizado com sucesso",
      comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comentário não encontrado"
      });
    }

    const course = await Course.findById(comment.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Curso não encontrado"
      });
    }

    const isCommentOwner =
      comment.userId.toString() === req.user.id;

    const isCourseInstructor =
      course.instructorId.toString() === req.user.id;

    if (!isCommentOwner && !isCourseInstructor) {
      return res.status(403).json({
        message: "Você não tem permissão para excluir este comentário"
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comentário deletado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comentário não encontrado"
      });
    }

    comment.replies.push({
      userId: req.user.id,
      text
    });

    await comment.save();

    await comment.populate("replies.userId", "name email roles");

    const commentOwner = await User.findById(comment.userId).select(
      "notificationsEnabled"
    );

    const isReplyingToOwnComment =
      comment.userId.toString() === req.user.id;

    if (
      commentOwner?.notificationsEnabled !== false &&
      !isReplyingToOwnComment
    ) {
      await Notification.create({
        userId: comment.userId,
        type: "comment_reply",
        title: "Nova resposta no seu comentário",
        message: "Alguém respondeu um comentário seu.",
        link: `/courses/${comment.courseId}`
      });
    }

    res.status(201).json({
      message: "Resposta criada com sucesso",
      comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comentário não encontrado"
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Resposta não encontrada"
      });
    }

    if (reply.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Você não tem permissão para editar esta resposta"
      });
    }

    reply.text = text;

    await comment.save();

    res.json({
      message: "Resposta atualizada com sucesso",
      comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comentário não encontrado"
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Resposta não encontrada"
      });
    }

    const course = await Course.findById(comment.courseId);

    const isReplyOwner =
      reply.userId.toString() === req.user.id;

    const isCourseInstructor =
      course.instructorId.toString() === req.user.id;

    if (!isReplyOwner && !isCourseInstructor) {
      return res.status(403).json({
        message: "Você não tem permissão para excluir esta resposta"
      });
    }

    reply.deleteOne();

    await comment.save();

    res.json({
      message: "Resposta deletada com sucesso",
      comment
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createComment,
  getContentComments,
  updateComment,
  deleteComment,
  createReply,
  updateReply,
  deleteReply
};