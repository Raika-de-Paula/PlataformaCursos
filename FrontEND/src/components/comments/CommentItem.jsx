import CommentAvatar from "./CommentAvatar";
import CommentMenu from "./CommentMenu";
import ReplyItem from "./ReplyItem";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export default function CommentItem({
  comment,
  user,
  activeRole,
  activeReplyTo,
  setActiveReplyTo,
  replyTexts,
  setReplyTexts,
  createReply,
  deleteComment,
  deleteReply,
  handleReply,
  formatDate,
  openMenuId,
  setOpenMenuId,
  openReplies,
  toggleReplies
}) {
  const repliesCount = comment.replies?.length || 0;
  const shouldShowReplies = repliesCount === 1 || openReplies[comment._id];

  const canDeleteComment = () => {
    return comment.userId?._id === user?.id || activeRole === "instructor";
  };

  const canDeleteReply = (reply) => {
    return reply.userId?._id === user?.id || activeRole === "instructor";
  };

  return (
    <div className="comment-thread">
      <div className="comment-row">
        <CommentAvatar user={comment.userId} />

        <div className="comment-main">
          <div className="comment-bubble">
            <div className="comment-top">
              <strong>{comment.userId?.name || "Usuário"}</strong>

              {canDeleteComment() && (
                <CommentMenu
                  id={comment._id}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onDelete={() => deleteComment(comment._id)}
                />
              )}
            </div>

            <p>{comment.text}</p>
          </div>

          <div className="comment-actions-line">
            <span>{formatDate(comment.createdAt)}</span>

            <button
              type="button"
              onClick={() =>
                handleReply(comment._id, comment.userId?.name || "usuario")
              }
            >
              Responder
            </button>
          </div>

          {repliesCount > 1 && (
            <button
                type="button"
                className="toggle-replies-btn"
                onClick={() => toggleReplies(comment._id)}
            >
                <span className="toggle-line"></span>

                <span className="toggle-text">
                {openReplies[comment._id]
                    ? "Ocultar respostas"
                    : `Exibir ${repliesCount} respostas`}
                </span>

                <span className="toggle-icon">
                {openReplies[comment._id] ? (
                    <MdExpandLess />
                ) : (
                    <MdExpandMore />
                )}
                </span>
            </button>
            )}

          {shouldShowReplies && repliesCount > 0 && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  commentId={comment._id}
                  canDeleteReply={canDeleteReply}
                  deleteReply={deleteReply}
                  handleReply={handleReply}
                  formatDate={formatDate}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                />
              ))}
            </div>
          )}

          {activeReplyTo === comment._id && (
            <div className="reply-form">
              <textarea
                placeholder="Responder..."
                value={replyTexts[comment._id] || ""}
                onChange={(e) =>
                  setReplyTexts((previousReplyTexts) => ({
                    ...previousReplyTexts,
                    [comment._id]: e.target.value
                  }))
                }
              />

              <div className="reply-form-actions">
                <button type="button" onClick={() => setActiveReplyTo(null)}>
                  Cancelar
                </button>

                <button type="button" onClick={() => createReply(comment._id)}>
                  Responder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}