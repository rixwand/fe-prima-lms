import * as React from "react";
import { IoChevronDown, IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";
import {
  LuCheck,
  LuChevronsRight,
  LuChevronsUpDown,
  LuClock,
  LuEllipsisVertical,
  LuEqual,
  LuPencil,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";

import { cn } from "@/lib/tiptap-utils";
import { useFolderTreeContext } from "@/libs/context/FolderTreeContext";
import { Button, Checkbox, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

export type FolderTreeProps = {
  courseSections: CourseSection[];
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
};

export const FolderTree: React.FC<FolderTreeProps> = ({ courseSections, activeLessonId, onSelect }) => {
  const { editMode } = useFolderTreeContext();
  return (
    <ul className={cn("m-0 flex list-none flex-col gap-1 ")} role="tree">
      {courseSections.map(section => (
        <CourseSectionItem key={section.id} section={section} activeLessonId={activeLessonId} onSelect={onSelect} />
      ))}
    </ul>
  );
};

const CourseSectionItem: React.FC<{
  section: CourseSection;
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
}> = ({ section, activeLessonId, onSelect }) => {
  const containsActiveLesson = React.useMemo(
    () => section.lessons.some(lesson => lesson.id === activeLessonId),
    [section.lessons, activeLessonId]
  );
  const {
    editMode,
    expandSectionsState: [expandValue, setExpand],
  } = useFolderTreeContext();
  const [isOpen, setIsOpen] = React.useState(containsActiveLesson || expandValue == true);
  const [editLesson, setEditLesson] = React.useState<number | null>(null);
  const [editSection, setEditSection] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (containsActiveLesson) {
      setIsOpen(true);
    }
  }, [containsActiveLesson]);

  React.useEffect(() => {
    if (expandValue != null) {
      setIsOpen(expandValue);
    }
  }, [expandValue]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    setExpand(null);
  };

  const inputSectionRef = React.useRef<HTMLInputElement>(null);
  const inputLessonRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputLessonRef.current && editLesson) {
      inputLessonRef.current.focus();
    }
  }, [editLesson]);

  React.useEffect(() => {
    if (inputSectionRef.current && editSection) {
      inputSectionRef.current.focus();
    }
  }, [editSection]);

  return (
    <li
      className="list-none"
      role="treeitem"
      aria-expanded={section.lessons.length > 0 ? isOpen : undefined}
      aria-selected={containsActiveLesson}>
      <span
        // type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg text-left transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0 focus-visible:border-none",
          // containsActiveLesson
          //   ? "dark:bg-[var(--tt-gray-dark-a-200)] border border-blue-400 text-blue-500"
          //   :
          "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]",
          // "border border-abu"
          editSection == null ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]"
        )}
        onClick={handleToggle}>
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center",
            containsActiveLesson ? "" : "text-[var(--tt-theme-text-muted)]"
          )}>
          {isOpen ? <IoChevronDown /> : <IoChevronForward />}
        </span>
        {editMode && <Checkbox radius="sm" size="sm" className="-mr-4" />}
        {editSection === section.id ? (
          <input
            ref={inputSectionRef}
            className="w-full border text-sm px-1 py-1 bg-gray-100 border-gray-300 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-md"
            onClick={e => e.stopPropagation()}
            defaultValue={section.title}
            onBlur={() => setEditSection(null)}
            onFocus={() => inputSectionRef.current?.select()}
          />
        ) : (
          <React.Fragment>
            <span className="flex-1 truncate text-sm font-medium text-left">{section.title}</span>
            {editMode ? (
              <span className="text-left py-1 px-0.5">
                <LuChevronsUpDown size={16} />
              </span>
            ) : (
              <Popover placement="bottom-start" radius="sm">
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    size="lg"
                    className="reset-button py-1 px-0.5 rounded data-[hover=true]:bg-white"
                    radius="none"
                    variant="light">
                    <LuEllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-36">
                  <Listbox variant="light" color="primary" aria-label="Actions">
                    <ListboxItem startContent={<LuPlus />} key="new">
                      New lesson
                    </ListboxItem>
                    <ListboxItem onPress={() => setEditSection(section.id)} startContent={<LuPencil />} key="edit">
                      Rename
                    </ListboxItem>
                    <ListboxItem startContent={<LuTrash2 />} key="delete" className="text-danger" color="danger">
                      Delete
                    </ListboxItem>
                  </Listbox>
                </PopoverContent>
              </Popover>
            )}
          </React.Fragment>
        )}
      </span>

      {isOpen ? (
        <ul
          className="mt-1 ml-4 flex list-none flex-col gap-1 border-l border-[var(--tt-border-color)] px-3"
          role="group">
          {section.lessons.map(lesson => {
            const isActiveLesson = lesson.id === activeLessonId;
            const path = [section.title, lesson.title];

            const handleSelectLesson = () => {
              onSelect(section, lesson, path);
            };

            return (
              <li key={lesson.id} className="list-none" role="treeitem" aria-selected={isActiveLesson}>
                <span
                  className={cn(
                    "flex w-full items-center gap-1 rounded-lg border-l-2 border-transparent pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0 cursor-pointer",
                    isActiveLesson
                      ? "border-[var(--tt-brand-color-500)] bg-[var(--tt-brand-color-50)] text-blue-600 font-medium dark:border-[var(--tt-brand-color-400)] dark:bg-[rgba(91,126,238,0.2)]"
                      : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]",
                    editLesson != lesson.id ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]"
                  )}
                  onClick={handleSelectLesson}>
                  {editMode ? (
                    <Checkbox radius="sm" size="sm" />
                  ) : isActiveLesson ? (
                    <span className="text-blue-600 dark:text-blue-400">
                      <LuChevronsRight size={16} />
                    </span>
                  ) : (
                    <span className="block h-4 w-4 shrink-0 rounded-full" />
                  )}
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
                    <IoDocumentTextOutline />
                  </span>
                  {editLesson === lesson.id ? (
                    <input
                      ref={inputLessonRef}
                      className={cn(
                        "w-full border text-sm px-1 py-1 focus:outline-0 text-[var(--tt-theme-text)] rounded-md",
                        isActiveLesson ? "bg-gray-50 border-blue-400" : "bg-gray-100 border-gray-300"
                      )}
                      onClick={e => e.stopPropagation()}
                      defaultValue={lesson.title}
                      onBlur={() => setEditLesson(null)}
                      onFocus={() => inputLessonRef.current?.select()}
                    />
                  ) : (
                    <React.Fragment>
                      <span className="flex-1 truncate text-sm text-left">{lesson.title}</span>
                      <Popover radius="sm" showArrow>
                        <PopoverTrigger>
                          <Button
                            type="button"
                            variant="light"
                            isIconOnly
                            className="reset-button text-gray-500 text-right text-xs mr-5 italic hover:bg-white px-2 rounded cursor-pointer py-1 data-[hover=true]:bg-white">
                            0 min
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          onClick={e => e.stopPropagation()}
                          className="p-2 flex flex-row items-end max-w-40 gap-x-1">
                          <Input
                            classNames={{
                              inputWrapper: "min-h-7 h-7",
                              label: "text-slate-800",
                              input: "group-data-[has-value=true]:text-slate-700",
                            }}
                            onClick={e => e.stopPropagation()}
                            label="Duration (minute)"
                            labelPlacement="outside-top"
                            radius="sm"
                            size="sm"
                            placeholder="0"
                            startContent={
                              <div className="pointer-events-none text-default-400 flex items-center">
                                <LuClock />
                              </div>
                            }
                            type="number"
                          />
                          <Button
                            variant="flat"
                            color="primary"
                            isIconOnly
                            className="reset-button p-2"
                            size="sm"
                            radius="sm">
                            <LuCheck />
                          </Button>
                        </PopoverContent>
                      </Popover>
                      {editMode ? (
                        <span className="py-1 px-0.5">
                          <LuEqual size={16} />
                        </span>
                      ) : (
                        <Popover placement="bottom-start" radius="sm">
                          <PopoverTrigger>
                            <Button
                              isIconOnly
                              size="lg"
                              className="reset-button py-1 px-0.5 rounded data-[hover=true]:bg-white"
                              radius="none"
                              variant="light">
                              <LuEllipsisVertical />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-2 w-36">
                            <Listbox variant="light" color="primary" aria-label="Actions">
                              <ListboxItem
                                onPress={() => setEditLesson(lesson.id)}
                                startContent={<LuPencil />}
                                key="edit">
                                Rename
                              </ListboxItem>
                              <ListboxItem
                                startContent={<LuTrash2 />}
                                key="delete"
                                className="text-danger"
                                color="danger">
                                Delete
                              </ListboxItem>
                            </Listbox>
                          </PopoverContent>
                        </Popover>
                      )}
                    </React.Fragment>
                  )}
                </span>
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
