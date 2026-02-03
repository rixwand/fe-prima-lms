export const findFirstSelectableLesson = (
  sections: CourseSection[],
): { section: CourseSection; lesson: Lesson; path: string[] } | null => {
  for (const section of sections) {
    if (section.lessons.length === 0) continue;
    const lesson = section.lessons[0];
    return {
      section,
      lesson,
      path: [section.title, lesson.title],
    };
  }
  return null;
};

export const getCourseStatus = (course: Pick<CourseListItem, "takenDownAt" | "publishRequest" | "publishedAt">) => {
  if (course.takenDownAt) return "ARCHIVED";
  if (course.publishRequest?.status === "PENDING") return "PENDING";
  if (course.publishedAt) return "PUBLISHED";
  if (course.publishRequest?.status === "REJECTED") return "REJECTED";
  return "DRAFT";
};
