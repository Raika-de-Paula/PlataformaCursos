// src/components/Comments.jsx

import { useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext";
import CommentItem from "./comments/CommentItem";
import CommentForm from "./comments/CommentForm";
import "../styles/Comments.css";

export default function Comments({ courseId, sectionId, contentId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [activeReplyTo, setActiveReplyTo] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  const { user, activeRole } = useContext(AuthContext);

  const loadComments = useCallback(async () => {
    if (!contentId) return;

    try {
      const response = await api.get(`/contents/${contentId}/comments`);
      setComments(response.data);
    } catch {
      alert("Erro ao carregar comentários");
    }
  }, [contentId]);

  useEffect(() => {
    const fetchComments = async () => {
      await loadComments();
    };

    fetchComments();
  }, [loadComments]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const createComment = useCallback(
    async (e) => {
      e.preventDefault();

      if (!text.trim()) return;

      try {
        await api.post(
          `/courses/${courseId}/sections/${sectionId}/contents/${contentId}/comments`,
          { text }
        );

        setText("");
        await loadComments();
      } catch (error) {
        alert(error.response?.data?.message || "Erro ao comentar");
      }
    },
    [courseId, sectionId, contentId, text, loadComments]
  );

  const createReply = useCallback(
    async (commentId) => {
      const replyText = replyTexts[commentId];

      if (!replyText?.trim()) return;

      try {
        await api.post(`/comments/${commentId}/replies`, {
          text: replyText
        });

        setReplyTexts((previousReplyTexts) => ({
          ...previousReplyTexts,
          [commentId]: ""
        }));

        setActiveReplyTo(null);
        await loadComments();
      } catch (error) {
        alert(error.response?.data?.message || "Erro ao responder");
      }
    },
    [replyTexts, loadComments]
  );

  const handleReply = (commentId, userName) => {
    setActiveReplyTo(commentId);

    setReplyTexts((previousReplyTexts) => ({
      ...previousReplyTexts,
      [commentId]: previousReplyTexts[commentId] || `@${userName} `
    }));
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setOpenMenuId(null);
      await loadComments();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir comentário");
    }
  };

  const deleteReply = async (commentId, replyId) => {
    try {
      await api.delete(`/comments/${commentId}/replies/${replyId}`);
      setOpenMenuId(null);
      await loadComments();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir resposta");
    }
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((previousOpenReplies) => ({
      ...previousOpenReplies,
      [commentId]: !previousOpenReplies[commentId]
    }));
  };

  return (
    <div className="comments-box">
      <div className="comments-list">
        {comments.length === 0 && (
          <p className="empty-comments">Nenhum comentário ainda.</p>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            user={user}
            activeRole={activeRole}
            activeReplyTo={activeReplyTo}
            setActiveReplyTo={setActiveReplyTo}
            replyTexts={replyTexts}
            setReplyTexts={setReplyTexts}
            createReply={createReply}
            deleteComment={deleteComment}
            deleteReply={deleteReply}
            handleReply={handleReply}
            formatDate={formatDate}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            openReplies={openReplies}
            toggleReplies={toggleReplies}
          />
        ))}
      </div>

      <CommentForm text={text} setText={setText} onSubmit={createComment} />
    </div>
  );
}