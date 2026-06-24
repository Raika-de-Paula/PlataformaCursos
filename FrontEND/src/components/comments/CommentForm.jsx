export default function CommentForm({ text, setText, onSubmit }) {
  return (
    <form className="comment-form" onSubmit={onSubmit}>
      <textarea
        placeholder="Escreva um comentário..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Comentar</button>
    </form>
  );
}