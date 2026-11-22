import ProfilePhoto from "./ProfilePhoto";
import ProfileArrayField from "./ProfileArrayField";
import ProfileLinksField from "./ProfileLinksField";
import ProfileBio from "./ProfileBio";
import "../../styles/Profile.css";

export default function ProfileForm({
  isInstructor,
  profile,
  form,
  photoPreview,
  handleSubmit,
  handleChange,
  handlePhotoChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  handleLinkChange,
  addLink,
  removeLink
}) {
  return (
    <main className="profile-page">
      <section className="profile-card">
        <h1>{isInstructor ? "Perfil do Instrutor" : "Perfil do Aluno"}</h1>

        <form onSubmit={handleSubmit}>
          <ProfilePhoto
            photoPreview={photoPreview}
            photoUrl={profile.photoUrl}
            handlePhotoChange={handlePhotoChange}
          />

          <ProfileArrayField
            title="Emails Públicos"
            field="emails"
            values={form.emails}
            placeholder="estudante@gmail.com"
            addLabel="Adicionar email"
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />

          <ProfileArrayField
            title="Telefones / WhatsApp"
            field="phones"
            values={form.phones}
            placeholder="7511232180"
            addLabel="Adicionar telefone"
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />

          <ProfileLinksField
            links={form.links}
            handleLinkChange={handleLinkChange}
            addLink={addLink}
            removeLink={removeLink}
          />

          {!isInstructor && (
            <ProfileArrayField
              title="Interesses"
              field="interests"
              values={form.interests}
              placeholder="Ex: React"
              addLabel="Adicionar interesse"
              handleArrayChange={handleArrayChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          )}

          {isInstructor && (
            <>
              <ProfileArrayField
                title="Formação acadêmica"
                field="academicBackground"
                values={form.academicBackground}
                placeholder="Graduação em..."
                addLabel="Adicionar formação"
                handleArrayChange={handleArrayChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />

              <ProfileArrayField
                title="Especialidades"
                field="specialties"
                values={form.specialties}
                placeholder="Ex: Design de Interfaces"
                addLabel="Adicionar especialidade"
                handleArrayChange={handleArrayChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            </>
          )}

          <ProfileBio bio={form.bio} handleChange={handleChange} />

          <div className="profile-actions">
            <button type="button" className="profile-cancel-btn">
              Cancelar
            </button>

            <button type="submit" className="profile-save-btn">
              Salvar Perfil
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}