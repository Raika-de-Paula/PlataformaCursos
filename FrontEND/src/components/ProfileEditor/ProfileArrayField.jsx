import { FiTrash2 } from "react-icons/fi";

export default function ProfileArrayField({
  title,
  field,
  values,
  placeholder,
  addLabel,
  handleArrayChange,
  addArrayItem,
  removeArrayItem
}) {
  return (
    <section className="profile-form-section">
      <div className="profile-section-header">
        <h3>{title}</h3>

        <button type="button" onClick={() => addArrayItem(field)}>
          + {addLabel}
        </button>
      </div>

      {values.map((value, index) => (
        <div key={index} className="profile-input-row">
          <input
            placeholder={placeholder}
            value={value}
            onChange={(e) =>
              handleArrayChange(field, index, e.target.value)
            }
          />

          <button
            type="button"
            className="profile-remove-btn"
            onClick={() => removeArrayItem(field, index)}
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </section>
  );
}