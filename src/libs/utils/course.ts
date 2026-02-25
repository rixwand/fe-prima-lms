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

export const normalizeTiptapContent = (node: JSONContent): JSONContent => {
  const normalized: JSONContent = {
    type: node.type,
  };

  // normalize attrs
  if (node.attrs) {
    const attrs = Object.fromEntries(Object.entries(node.attrs).filter(([, value]) => value !== undefined));
    if (Object.keys(attrs).length) {
      normalized.attrs = attrs;
    }
  }

  // normalize content
  if (node.content && node.content.length > 0) {
    normalized.content = node.content.map(normalizeTiptapContent);
  }

  // normalize text
  if (node.text !== undefined) {
    normalized.text = node.text;
  }

  return normalized;
};
