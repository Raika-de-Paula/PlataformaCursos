import { getStatusText } from "./courseUtils";

export default function CourseHero({ course }) {
  return (
    <section
      className="course-hero"
      style={{
        backgroundImage: course.thumbnail
          ? `linear-gradient(rgba(7, 11, 24, 0.72), rgba(17, 24, 39, 0.72)), url(${course.thumbnail})`
          : undefined
      }}
    >
      <span className={`course-status ${course.status}`}>
        {getStatusText(course.status)}
      </span>

      <h1>{course.title}</h1>

      <p>{course.description}</p>
    </section>
  );
}