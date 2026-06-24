//src/components/comments/CommentAvatar.jsx

export default function CommentAvatar({ user, className = "comment-avatar" }) {
  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarUrl = (photoUrl) => {
    if (!photoUrl) return "";
    if (photoUrl.startsWith("http")) return photoUrl;

    return `http://localhost:3000/${photoUrl}`;
  };

  return (
    <div className={className}>
      {user?.photoUrl ? (
        <img
          src={getAvatarUrl(user.photoUrl)}
          alt={user?.name || "Usuário"}
        />
      ) : (
        getInitials(user?.name)
      )}
    </div>
  );
}