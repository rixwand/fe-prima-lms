import * as React from "react";
import { IoChevronDown, IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";
import { LuChevronsRight } from "react-icons/lu";

import { cn } from "@/libs/tiptap/tiptap-utils";

export type FolderTreeProps = {
  courseSections: CourseSection[];
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
};

export const FolderTree: React.FC<FolderTreeProps> = ({ courseSections, activeLessonId, onSelect }) => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0" role="tree">
    {courseSections.map(section => (
      <CourseSectionItem key={section.id} section={section} activeLessonId={activeLessonId} onSelect={onSelect} />
    ))}
  </ul>
);

const CourseSectionItem: React.FC<{
  section: CourseSection;
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
}> = ({ section, activeLessonId, onSelect }) => {
  const containsActiveLesson = React.useMemo(
    () => section.lessons.some(lesson => lesson.id === activeLessonId),
    [section.lessons, activeLessonId]
  );
  const [isOpen, setIsOpen] = React.useState(containsActiveLesson);

  React.useEffect(() => {
    if (containsActiveLesson) {
      setIsOpen(true);
    }
  }, [containsActiveLesson]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <li
      className="list-none"
      role="treeitem"
      aria-expanded={section.lessons.length > 0 ? isOpen : undefined}
      aria-selected={containsActiveLesson}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0 focus-visible:border-none",
          containsActiveLesson
            ? "dark:bg-[var(--tt-gray-dark-a-200)] border border-blue-400 text-blue-500"
            : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]"
        )}
        onClick={handleToggle}>
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center",
            containsActiveLesson ? "" : "text-[var(--tt-theme-text-muted)]"
          )}>
          {isOpen ? <IoChevronDown /> : <IoChevronForward />}
        </span>
        <span className="flex-1 truncate text-sm font-medium text-left">{section.title}</span>
      </button>

      {isOpen ? (
        <ul
          className="mt-1 ml-4 flex list-none flex-col gap-1 border-l border-[var(--tt-border-color)] pl-3"
          role="group">
          {section.lessons.map(lesson => {
            const isActiveLesson = lesson.id === activeLessonId;
            const path = [section.title, lesson.title];

            const handleSelectLesson = () => {
              onSelect(section, lesson, path);
            };

            return (
              <li key={lesson.id} className="list-none" role="treeitem" aria-selected={isActiveLesson}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-1 rounded-lg border-l-2 border-transparent px-2 py-1.5 pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0",
                    isActiveLesson
                      ? "border-[var(--tt-brand-color-500)] bg-[var(--tt-brand-color-50)] text-blue-600 font-medium dark:border-[var(--tt-brand-color-400)] dark:bg-[rgba(91,126,238,0.2)]"
                      : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]"
                  )}
                  onClick={handleSelectLesson}>
                  {isActiveLesson ? (
                    <span className="text-blue-600 dark:text-blue-400">
                      <LuChevronsRight size={16} />
                    </span>
                  ) : (
                    <span className="block h-4 w-4 shrink-0 rounded-full" />
                  )}
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
                    <IoDocumentTextOutline />
                  </span>
                  <span className="flex-1 truncate text-sm text-left">{lesson.title}</span>
                </button>
              </li>
            );
          })}
          {section.lessons.length == 0 ? (
            <p className="text-sm pl-3 text-[var(--tt-theme-text-muted)]">No lesson found</p>
          ) : null}
        </ul>
      ) : null}
    </li>
  );
};
