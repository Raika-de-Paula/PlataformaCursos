import { FiTrash2 } from "react-icons/fi";

export default function ProfileLinksField({
  links,
  handleLinkChange,
  addLink,
  removeLink
}) {
  return (
    <section className="profile-form-section">
      <div className="profile-section-header">
        <h3>Links</h3>

        <button type="button" onClick={addLink}>
          + Adicionar link
        </button>
      </div>

      {links.map((link, index) => (
        <div key={index} className="profile-link-row">
          <input
            placeholder="Título (ex: LinkedIn)"
            value={link.label}
            onChange={(e) =>
              handleLinkChange(index, "label", e.target.value)
            }
          />

          <input
            placeholder="URL (https://...)"
            value={link.url}
            onChange={(e) =>
              handleLinkChange(index, "url", e.target.value)
            }
          />

          <button
            type="button"
            className="profile-remove-btn"
            onClick={() => removeLink(index)}
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </section>
  );
}