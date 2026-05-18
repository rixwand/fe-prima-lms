import NormalCkbox from "@/components/commons/NormalCkbox";
import { ItemIcon } from "@/components/views/Instructor/Course/EditCourse/Forms/FolderTree/SectionItem/LessonItem/Lessonitem";
import { itemTypeSelect } from "@/components/views/Instructor/Course/EditCourse/Forms/FolderTree/SectionItem/SectionItem";
import { cn } from "@/libs/tiptap/tiptap-utils";
import { toRoundedMinutes } from "@/libs/utils/string";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { LuCheck, LuClock, LuEllipsisVertical, LuEqual, LuPencil, LuTrash2 } from "react-icons/lu";
import { CourseForm, CourseItemForm, CourseSectionForm } from "../../../../form.type";

const CourseLessonItem = ({
  lesson,
  section,
  isChecked,
  onCheck,
  editMode,
  onRemove,
  onRename,
  idx,
  sectionIdx,
}: {
  sectionIdx: number;
  idx: number;
  lesson: CourseItemForm;
  section: CourseSectionForm;
  onCheck: () => void;
  onRename: (idx: number, title: string, type: SectionItemType) => void;
  onRemove: (idx: number) => void;
  isChecked: boolean;
  editMode: boolean;
}) => {
  const durationPath = `sections.${sectionIdx}.items.${idx}.durationSec` as const;
  const { control } = useFormContext<CourseForm>();
  const [editLesson, setEditLesson] = useState<{ id: string; title: string; type: SectionItemType } | null>(null);
  const [isOpenDuration, setOpenDuration] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const selectOpenRef = useRef(false);
  const skipResetSelectedTypeRef = useRef(false);
  const inputNewItemRef = useRef<HTMLInputElement>(null);

  const inputLessonRef = useRef<HTMLInputElement>(null);
  const inputDurationRef = useRef<HTMLInputElement>(null);
  const inputSelectTypeRef = useRef<HTMLSelectElement>(null);

  const durationSec = useWatch({ control, name: durationPath });

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

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: lesson.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    border: 1,
  } as CSSProperties;

  const handleRenameLesson = () => (editLesson ? onRename(idx, editLesson.title, editLesson.type) : null);
  const focusNewItemInput = () => {
    skipResetSelectedTypeRef.current = true;
    requestAnimationFrame(() => {
      inputNewItemRef.current?.focus();
      requestAnimationFrame(() => {
        skipResetSelectedTypeRef.current = false;
      });
    });
  };
  const handleSelectOpenChange = (isOpen: boolean) => {
    if (!isOpen) focusNewItemInput();
    selectOpenRef.current = isOpen;
    setSelectOpen(isOpen);
  };

  return (
    <li
      {...(editMode && { ...listeners, ...attributes })}
      ref={setNodeRef}
      style={style}
      data-sortable-lesson={lesson.id}
      data-sortable-lesson-section={section.title}
      className="list-none"
      tabIndex={-1}
      onBlur={e => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
          if (skipResetSelectedTypeRef.current) return;
          if (selectOpenRef.current) return;
          const focusedElement = document.activeElement;
          if (focusedElement && currentTarget.contains(focusedElement)) return;
          setEditLesson(null);
        });
      }}>
      <span
        className={cn(
          "flex w-full items-center gap-1 rounded-lg pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150 cursor-pointer",
          "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]",
          editLesson?.id != lesson.id ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]",
        )}>
        {editMode ? (
          <NormalCkbox
            className="p-0 px-2"
            onValueChange={onCheck}
            isSelected={isChecked}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="block h-4 w-4 shrink-0 rounded-full" />
        )}
        {!editLesson && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
            <ItemIcon type={lesson.type} />
          </span>
        )}
        {editLesson && editLesson.id === lesson.id ? (
          <Fragment>
            <Select
              aria-label="Select Item type"
              ref={inputSelectTypeRef}
              isOpen={selectOpen}
              onOpenChange={handleSelectOpenChange}
              items={itemTypeSelect}
              className="max-w-[6.65rem]"
              size="sm"
              selectedKeys={editLesson ? [editLesson.type] : undefined}
              onSelectionChange={keys => {
                setSelectOpen(false);
                const value = Array.from(keys)[0] as SectionItemType;
                if (!value) return;
                setEditLesson(v => (v ? { ...v, type: value } : { ...lesson, type: value }));
              }}
              classNames={{
                selectorIcon: "-mr-1.5",
                trigger: "border-1 border-gray-300 focus-within:ring-blue-500 focus-within:ring-1",
                popoverContent: "rounded-lg p-0",
              }}
              renderValue={items => {
                return items.map(({ data, key }) =>
                  data ? (
                    <span key={key} className="flex items-center gap-x-1">
                      <data.icon size={16} />
                      {data.label}
                    </span>
                  ) : null,
                );
              }}>
              {({ icon: Icon, key, label }) => (
                <SelectItem aria-label={label} key={key}>
                  <span className="flex items-center gap-x-1">
                    <Icon size={16} />
                    {label}
                  </span>
                </SelectItem>
              )}
            </Select>
            <input
              type="text"
              ref={inputLessonRef}
              className={cn(
                "w-full border text-sm px-1 py-1 focus:outline-0 text-[var(--tt-theme-text)] rounded-md",
                "bg-gray-100 border-gray-300",
              )}
              onClick={e => e.stopPropagation()}
              value={editLesson.title}
              onChange={e => setEditLesson(v => ({ id: lesson.id!, title: e.target.value, type: lesson.type }))}
              onFocus={() => inputLessonRef.current?.select()}
              onKeyDown={e => {
                if (e.key == "Escape") setEditLesson(null);
                if (e.key == "Enter") {
                  e.preventDefault();
                  handleRenameLesson();
                }
              }}
            />
            <Button
              onPress={handleRenameLesson}
              variant="flat"
              color="primary"
              isIconOnly
              className="reset-button p-2 rounded-md"
              size="sm"
              radius="none">
              <LuCheck />
            </Button>
          </Fragment>
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
                  {toRoundedMinutes(durationSec || undefined)} min
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onClick={e => e.stopPropagation()}
                className="p-2 flex flex-row items-end max-w-40 gap-x-1">
                <Controller
                  control={control}
                  name={durationPath}
                  render={({ field }) => (
                    <Input
                      ref={inputDurationRef}
                      onFocus={() => inputDurationRef.current?.select()}
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
                      value={field.value ? `${field.value / 60}` : ""}
                      onValueChange={v => field.onChange(Number(v) * 60)}
                    />
                  )}
                />
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
                    <Listbox variant="light" color="primary" aria-label="Actions" onAction={() => setOpenMenu(false)}>
                      <ListboxItem
                        onPress={() => {
                          setEditLesson({ id: lesson.id!, title: lesson.title, type: lesson.type });
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
                      <ListboxItem
                        onPress={() => onRemove(idx)}
                        startContent={<LuTrash2 />}
                        key="delete"
                        className="text-danger"
                        color="danger">
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
