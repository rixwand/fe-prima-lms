import { CourseSectionForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { cn } from "@/lib/tiptap-utils";
import { useFolderTreeContext } from "@/libs/context/FolderTreeContext";
import { toRoundedMinutes } from "@/libs/utils/string";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronsRight,
  LuClock,
  LuEllipsisVertical,
  LuEqual,
  LuFileText,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { OnSelect } from "../../FolderTree";

const CourseLessonItem = ({
  lesson,
  section,
  onSelect,
}: {
  lesson: NonNullable<CourseSectionForm["lessons"]>[number];
  section: CourseSectionForm;
  onSelect: OnSelect;
}) => {
  const { editMode, activeLessonId } = useFolderTreeContext();
  const isActiveLesson = lesson.id === activeLessonId;
  const path = [section.title, lesson.title];
  const [editLesson, setEditLesson] = useState<number | null>(null);
  const [isOpenDuration, setOpenDuration] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);

  const inputLessonRef = useRef<HTMLInputElement>(null);
  const inputDurationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputLessonRef.current && editLesson) {
      inputLessonRef.current.focus();
    }
  }, [editLesson]);

  useEffect(() => {
    if (isOpenDuration && inputDurationRef.current) {
      inputDurationRef.current.focus();
    }
  }, [isOpenDuration]);

  const handleSelectLesson = () => {
    onSelect(section, lesson, path);
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: lesson.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    border: 1,
  } as CSSProperties;

  return (
    <li
      {...(editMode && { ...listeners, ...attributes })}
      ref={setNodeRef}
      style={style}
      data-sortable-lesson={lesson.id}
      data-sortable-lesson-section={section.title}
      className="list-none"
      role="treeitem"
      aria-selected={isActiveLesson}>
      <span
        className={cn(
          "flex w-full items-center gap-1 rounded-lg pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150 cursor-pointer",
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
          <LuFileText />
        </span>
        {editLesson === lesson.id ? (
          <input
            type="text"
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
          <Fragment>
            <span className="flex-1 truncate text-sm text-left">{lesson.title}</span>
            <Popover radius="sm" showArrow isOpen={isOpenDuration} onOpenChange={open => setOpenDuration(open)}>
              <PopoverTrigger>
                <Button
                  disabled={editMode}
                  type="button"
                  variant="light"
                  isIconOnly
                  className="reset-button text-gray-500 text-right text-xs mr-5 italic hover:bg-white px-2 rounded cursor-pointer py-1 data-[hover=true]:bg-white">
                  {toRoundedMinutes(lesson.durationSec || undefined)} min
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onClick={e => e.stopPropagation()}
                className="p-2 flex flex-row items-end max-w-40 gap-x-1">
                <Input
                  onFocus={() => inputDurationRef.current?.select()}
                  ref={inputDurationRef}
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
                <Button variant="flat" color="primary" isIconOnly className="reset-button p-2" size="sm" radius="sm">
                  <LuCheck />
                </Button>
              </PopoverContent>
            </Popover>

            {editMode ? (
              <span className="py-1 px-0.5">
                <LuEqual size={16} />
              </span>
            ) : (
              <Fragment>
                <Popover
                  placement="bottom-start"
                  radius="sm"
                  isOpen={isOpenMenu}
                  onOpenChange={open => setOpenMenu(open)}>
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
                        onPress={() => {
                          setEditLesson(lesson.id!);
                          setOpenMenu(false);
                        }}
                        startContent={<LuPencil />}
                        key="edit">
                        Rename
                      </ListboxItem>
                      <ListboxItem
                        onPress={() => {
                          setOpenDuration(true);
                          setOpenMenu(false);
                        }}
                        startContent={<LuClock />}
                        key="duration">
                        Duration
                      </ListboxItem>
                      <ListboxItem startContent={<LuTrash2 />} key="delete" className="text-danger" color="danger">
                        Delete
                      </ListboxItem>
                    </Listbox>
                  </PopoverContent>
                </Popover>
              </Fragment>
            )}
          </Fragment>
        )}
      </span>
    </li>
  );
};

export default CourseLessonItem;
