import CourseContentItem from "./CourseContentItem";

export default function CourseSectionCard({
  section,
  isOpen,
  toggleSection,
  setSelectedContent
}) {
  return (
    <div className="course-section-card">
      <button
        className="section-header"
        onClick={() => toggleSection(section._id)}
      >
        <div>
          <strong>{section.title}</strong>
          <span>{section.contents.length} itens</span>
        </div>

        <span>{isOpen ? "⌃" : "⌄"}</span>
      </button>

      {isOpen && (
        <div className="section-content-list">
          {[...section.contents]
            .sort((a, b) => a.order - b.order)
            .map((content) => (
              <CourseContentItem
                key={content._id}
                content={content}
                sectionId={section._id}
                setSelectedContent={setSelectedContent}
              />
            ))}
        </div>
      )}
    </div>
  );
}