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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}/${url}`;
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