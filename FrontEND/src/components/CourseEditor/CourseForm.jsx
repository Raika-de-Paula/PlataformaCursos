// src/components/CourseEditor/CourseForm.jsx

export default function CourseForm({
  courseForm,
  handleCourseChange,
  updateCourseInfo,
  handleThumbnailChange,
  thumbnailPreview,
  currentThumbnail
}) {
  return (
    <section className="editor-card course-form-card">
      <h2>Informações Básicas</h2>

      <form onSubmit={updateCourseInfo}>
        <label>Capa do curso</label>

        {thumbnailPreview || currentThumbnail ? (
          <img
            className="editor-thumbnail"
            src={thumbnailPreview || currentThumbnail}
            alt="Capa do curso"
          />
        ) : (
          <div className="editor-thumbnail-empty">
            Nenhuma capa adicionada
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleThumbnailChange} />

        <label>Título do curso</label>
        <input
          name="title"
          placeholder="Título do curso"
          value={courseForm.title}
          onChange={handleCourseChange}
        />

        <label>Descrição do curso</label>
        <textarea
          name="description"
          placeholder="Descrição do curso"
          value={courseForm.description}
          onChange={handleCourseChange}
          rows="5"
        />

        <div className="editor-form-row">
          <div>
            <label>Categoria</label>
            <input
              name="category"
              placeholder="Categoria"
              value={courseForm.category}
              onChange={handleCourseChange}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={courseForm.status}
              onChange={handleCourseChange}
            >
              <option value="in_progress">Em andamento</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>
        </div>

        <div className="editor-actions">
          <button type="submit" className="editor-save-btn">
            Salvar Alterações
          </button>
        </div>
      </form>
    </section>
  );
}