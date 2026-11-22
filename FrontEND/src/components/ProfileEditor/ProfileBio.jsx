// src/components/ProfileEditor/ProfileBio.jsx

export default function ProfileBio({ bio, handleChange }) {
  return (
    <section className="profile-form-section">
      <h3>Biografia</h3>

      <textarea
        name="bio"
        placeholder="Conte um pouco sobre sua trajetória..."
        value={bio}
        onChange={handleChange}
        rows="6"
      />
    </section>
  );
}