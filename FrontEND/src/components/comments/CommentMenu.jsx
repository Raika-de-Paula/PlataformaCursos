//src/components/comments/CommentMenu.jsx

export default function CommentMenu({
  id,
  openMenuId,
  setOpenMenuId,
  onDelete
}) {
  return (
    <div className="comment-menu-wrapper">
      <button
        type="button"
        className="comment-menu-btn"
        onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
      >
        ⋯
      </button>

      {openMenuId === id && (
        <div className="comment-menu">
          <button type="button" onClick={onDelete}>
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}