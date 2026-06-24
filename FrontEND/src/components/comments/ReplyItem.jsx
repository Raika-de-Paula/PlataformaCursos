import CommentAvatar from "./CommentAvatar";
import CommentMenu from "./CommentMenu";

export default function ReplyItem({
  reply,
  commentId,
  canDeleteReply,
  deleteReply,
  handleReply,
  formatDate,
  openMenuId,
  setOpenMenuId
}) {
  return (
    <div className="reply-row">
      <CommentAvatar user={reply.userId} className="reply-avatar" />

      <div className="reply-main">
        <div className="reply-bubble">
          <div className="comment-top">
            <strong>{reply.userId?.name || "Usuário"}</strong>

            {canDeleteReply(reply) && (
              <CommentMenu
                id={reply._id}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                onDelete={() => deleteReply(commentId, reply._id)}
              />
            )}
          </div>

          <p>{reply.text}</p>
        </div>

        <div className="comment-actions-line">
          <span>{formatDate(reply.createdAt)}</span>

          <button
            type="button"
            onClick={() =>
              handleReply(commentId, reply.userId?.name || "usuario")
            }
          >
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}