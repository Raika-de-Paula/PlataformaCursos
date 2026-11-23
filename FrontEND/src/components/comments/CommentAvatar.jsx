// src/components/comments/CommentAvatar.jsx

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className={className}>
      {user?.photoUrl ? (
        <img
          src={getImageUrl(user.photoUrl)}
          alt={user?.name || "Usuário"}
        />
      ) : (
        getInitials(user?.name)
      )}
    </div>
  );
}