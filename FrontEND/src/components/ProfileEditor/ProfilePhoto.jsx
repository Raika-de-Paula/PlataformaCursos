import { IoCameraOutline } from "react-icons/io5";

export default function ProfilePhoto({
  photoPreview,
  photoUrl,
  handlePhotoChange
}) {
  return (
    <div className="profile-photo-section">
      <div className="profile-avatar-wrapper">
        {photoPreview || photoUrl ? (
          <img
            src={photoPreview || photoUrl}
            alt="Foto de perfil"
            className="profile-photo-preview"
          />
        ) : (
          <div className="profile-photo-empty">
            Foto de Perfil
          </div>
        )}

        <label className="profile-photo-button">
            <IoCameraOutline />
            <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
            />
        </label>
      </div>

      <div>
        <strong>Foto de Perfil</strong>
        <p>JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
        <label className="profile-change-link">
          Alterar imagem
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
      </div>
    </div>
  );
}