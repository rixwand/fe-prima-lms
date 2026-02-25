import * as React from "react";
import { IoChevronDown, IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";

import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { useNProgress } from "@/hooks/use-nProgress";
import { getErrorMessage } from "@/libs/axios/error";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { cn } from "@/libs/tiptap/tiptap-utils";
import courseQueries from "@/queries/course-queries";
import courseSectionService from "@/services/course-section.service";
import { StateType } from "@/types/Helper";
import { AppAxiosError } from "@/types/axios";
import { Button, addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuBookmark, LuGlobeLock } from "react-icons/lu";

export type FolderTreeProps = {
  courseSections: CourseSection[];
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
  expandedState: StateType<Set<number>>;
};

export const FolderTree: React.FC<FolderTreeProps> = ({ expandedState, courseSections, activeLessonId, onSelect }) => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0" role="tree">
    {courseSections.map(section => (
      <CourseSectionItem key={section.id} {...{ section, onSelect, activeLessonId, expandedState }} />
    ))}
  </ul>
);

const CourseSectionItem: React.FC<{
  section: CourseSection;
  expandedState: StateType<Set<number>>;
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
}> = ({ section, activeLessonId, onSelect, expandedState: [expanded, setExpanded] }) => {
  const isOpen = React.useMemo(() => expanded.has(section.id), [expanded, section.id]);
  const { courseId } = useLessonEditorContext();
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: courseSectionService.publish,
    onError: error => {
      addToast({
        title: "Publish Section Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      addToast({
        color: "success",
        title: "Success",
        description: "Success publish section",
      });
      qc.invalidateQueries({
        queryKey: courseQueries.keys.getCourse(courseId),
      });
    },
  });

  const containsActiveLesson = React.useMemo(
    () => section.lessons.some(lesson => lesson.id === activeLessonId),
    [section.lessons, activeLessonId],
  );
  const handleToggle = () => {
    setExpanded(v => {
      const curr = new Set(v);
      if (curr.has(section.id)) curr.delete(section.id);
      else curr.add(section.id);
      return curr;
    });
  };
  const handlePublishSection = () =>
    confirmDialog({
      title: "Publish Section",
      desc: "Every lesson published underneath this section will visible to student",
      onConfirmed() {
        mutate({ courseId, sectionId: section.id });
      },
    });
  React.useEffect(() => {
    if (containsActiveLesson) {
      console.log("containsActiveLesson: ", section.id);
      setExpanded(v => new Set([...v, section.id]));
    }
  }, [containsActiveLesson, setExpanded, section.id]);
  useNProgress(isPending);
  return (
    <li
      className="list-none"
      role="treeitem"
      aria-expanded={section.lessons.length > 0 ? isOpen : undefined}
      aria-selected={isOpen}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0 focus-visible:border-none",
          // containsActiveLesson ? "dark:bg-[var(--tt-gray-dark-a-200)] border border-blue-400 text-blue-500" :
          "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]",
          section.lessons.some(({ publishedAt }) => publishedAt == null) && "text-primary",
        )}
        onClick={handleToggle}>
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center",
            // containsActiveLesson ? "" : "text-[var(--tt-theme-text-muted)]",
          )}>
          {isOpen ? <IoChevronDown /> : <IoChevronForward />}
        </span>
        <span className="flex-1 truncate text-sm font-medium text-left">{section.title}</span>
        {/* <NormalCkbox className="p-0" onClick={e => e.stopPropagation()} /> */}
        {!section.publishedAt && (
          // <span className="w-2 h-2 rounded-full bg-primary-200" />
          <Button
            onPress={handlePublishSection}
            isIconOnly
            className="reset-button p-1 rounded-md"
            radius="none"
            color="primary"
            variant="light">
            <LuGlobeLock size={15} />
          </Button>
        )}
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
                    "flex w-full items-center gap-1 rounded-lg border-l-2 border-transparent pl-2.5 px-2 py-1.5 text-left text-[var(--tt-theme-text)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0",
                    isActiveLesson
                      ? //  "border-[var(--tt-brand-color-500)] bg-[var(--tt-brand-color-50)] text-blue-600 font-medium dark:border-[var(--tt-brand-color-400)] dark:bg-[rgba(91,126,238,0.2)]"
                        "bg-[var(--tt-gray-light-a-100)] dark:bg-[var(--tt-gray-dark-a-100)]"
                      : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]",
                    !lesson.publishedAt && "text-primary",
                  )}
                  onClick={handleSelectLesson}>
                  {/* {isActiveLesson ? (
                    <span className="text-blue-600 dark:text-blue-400">
                      <LuChevronsRight size={16} />
                    </span>
                  ) : (
                    <span className="block h-4 w-4 shrink-0 rounded-full" />
                  )} */}
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
                    <IoDocumentTextOutline />
                  </span>
                  <span className="flex-1 truncate text-sm text-left">{lesson.title}</span>
                  {!lesson.publishedAt && <LuBookmark size={12} color="primary" />}
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
