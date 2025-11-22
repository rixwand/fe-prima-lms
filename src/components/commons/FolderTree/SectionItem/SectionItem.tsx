import { useFolderTreeContext } from "@/libs/context/FolderTreeContext";
import cn from "@/libs/utils/cn";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { CSSProperties, FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { LuChevronsUpDown, LuEllipsisVertical, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { CourseSectionForm, OnSelect } from "../FolderTree";
import CourseLessonItem from "./LessonItem";
const CourseSectionItem: FC<{
  section: CourseSectionForm;
  activeLessonId?: number | null;
  onSelect: OnSelect;
  expanded?: boolean;
  idx: number;
  overlay?: boolean;
}> = ({ section, activeLessonId, onSelect, expanded, idx, overlay = false }) => {
  const {
    resetSections,
    editMode,
    expandSectionsState: [expandValue, setExpand],
  } = useFolderTreeContext();
  const [isOpen, setIsOpen] = useState(expandValue == true || expanded == true);
  const [editSection, setEditSection] = useState<number | null>(null);
  useEffect(() => {
    if (expandValue != null) {
      setIsOpen(expandValue);
    }
  }, [expandValue]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    setExpand(null);
  };
  const inputSectionRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputSectionRef.current && editSection) {
      inputSectionRef.current.focus();
    }
  }, [editSection]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: section.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    border: 1,
  } as CSSProperties;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const { control, reset } = useFormContext<CourseForm>();
  const { fields, move, remove, append } = useFieldArray({
    control,
    name: `sections.${idx}.lessons`,
    keyName: "fieldId",
  });
  const ids = useMemo(() => fields.map(s => s.id!), [fields]);
  const handleDrag = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = fields.findIndex(s => s.id === active.id);
    const to = fields.findIndex(s => s.id === over.id);
    if (from === -1 || to === -1) return;
    move(from, to);
  };
  useEffect(() => {
    // reset();
  }, [resetSections]);
  return (
    <li
      {...(editMode && { ...listeners, ...attributes })}
      data-section-sortable={section.id}
      ref={setNodeRef}
      style={style}
      className="list-none"
      role="treeitem"
      aria-expanded={isOpen}
      aria-selected={isOpen}>
      <span
        className={cn(
          "flex w-full items-center gap-2 rounded-lg text-left transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0 focus-visible:border-none",
          "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]",
          editSection == null ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]"
        )}
        onClick={handleToggle}>
        <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center")}>
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
          <Fragment>
            <span className="flex-1 truncate text-sm font-medium text-left">
              {section.title} pos{section.position}
            </span>
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
                    <ListboxItem onPress={() => setEditSection(section.id!)} startContent={<LuPencil />} key="edit">
                      Rename
                    </ListboxItem>
                    <ListboxItem startContent={<LuTrash2 />} key="delete" className="text-danger" color="danger">
                      Delete
                    </ListboxItem>
                  </Listbox>
                </PopoverContent>
              </Popover>
            )}
          </Fragment>
        )}
      </span>

      {isOpen ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrag}>
          <ul
            className="mt-1 ml-4 flex list-none flex-col gap-1 border-l border-[var(--tt-border-color)] px-3"
            role="group">
            <SortableContext strategy={verticalListSortingStrategy} items={ids}>
              {(overlay == true ? section.lessons : fields).map(lesson => (
                <CourseLessonItem
                  lesson={lesson}
                  activeLessonId={activeLessonId}
                  onSelect={onSelect}
                  section={section}
                  key={lesson.id}
                />
              ))}
            </SortableContext>
            {section.lessons.length == 0 ? (
              <p className="text-sm pl-3 text-[var(--tt-theme-text-muted)]">No lesson found</p>
            ) : null}
          </ul>
        </DndContext>
      ) : null}
    </li>
  );
};
export default CourseSectionItem;
