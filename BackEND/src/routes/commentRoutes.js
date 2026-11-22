//src/routes/commentRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const commentPermissionMiddleware = require("../middlewares/commentPermissionMiddleware");

const {
  createComment,
  getContentComments,
  updateComment,
  deleteComment,
  createReply,
  updateReply,
  deleteReply
} = require("../controllers/commentController");

const {
  commentValidator
} = require("../validators/commentValidator");

const validateMiddleware = require("../middlewares/validateMiddleware");

router.post(
  "/courses/:courseId/sections/:sectionId/contents/:contentId/comments",
  authMiddleware,
  commentPermissionMiddleware,
  commentValidator,
  validateMiddleware,
  createComment
);

router.post(
  "/comments/:commentId/replies",
  authMiddleware,
  commentValidator,
  validateMiddleware,
  createReply
);

router.get(
  "/contents/:contentId/comments",
  authMiddleware,
  getContentComments
);

router.patch(
  "/comments/:commentId",
  authMiddleware,
  updateComment
);

router.patch(
  "/comments/:commentId/replies/:replyId",
  authMiddleware,
  commentValidator,
  validateMiddleware,
  updateReply
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  deleteComment
);

router.delete(
  "/comments/:commentId/replies/:replyId",
  authMiddleware,
  deleteReply
);

module.exports = router;