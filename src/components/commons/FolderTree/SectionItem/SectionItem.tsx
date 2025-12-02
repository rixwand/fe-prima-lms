import useEditCurriculum from "@/components/views/Instructor/Course/EditCourse/Forms/CurriculumForm/useEditCurriculum";
import { CourseSectionForm, EditCourseForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { useNProgress } from "@/hooks/use-nProgress";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { useFolderTreeContext } from "@/libs/context/FolderTreeContext";
import { hasTrue } from "@/libs/utils/boolean";
import cn from "@/libs/utils/cn";
import { StateType } from "@/types/Helper";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { CSSProperties, FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import {
  LuCheck,
  LuChevronsUpDown,
  LuEllipsisVertical,
  LuFilePlus2,
  LuFileX,
  LuPencil,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { OnSelect } from "../FolderTree";
import CourseLessonItem from "./LessonItem";
const CourseSectionItem: FC<{
  section: CourseSectionForm;
  onSelect: OnSelect;
  expandState: StateType<Set<number>>;
  idx: number;
  overlay?: boolean;
  onRemove?: (id: number, title: string) => void;
}> = ({ section, onSelect, expandState: [expanded, setExpanded], idx, onRemove = () => {} }) => {
  const { editMode } = useFolderTreeContext();
  const [editSection, setEditSection] = useState<{ id: number; title: string } | null>(null);

  const handleToggle = () => {
    setExpanded(v => {
      const curr = new Set(v);
      if (curr.has(section.id!)) curr.delete(section.id!);
      else curr.add(section.id!);
      return curr;
    });
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
  const { control, reset, watch, getValues, resetField } = useFormContext<EditCourseForm>();
  const idIdx = getValues("sections")!.findIndex(s => s.id == section.id);
  const { fields, move, remove, append } = useFieldArray({
    control,
    name: `sections.${idIdx}.lessons`,
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

  const [newLesson, setNewLesson] = useState<string | null>(null);
  const inputNewLessonRef = useRef<HTMLInputElement>(null);
  const menuState = useOverlayTriggerState({ defaultOpen: false });

  useEffect(() => {
    if (newLesson && !menuState.isOpen) {
      setExpanded(prev => new Set([...prev, section.id!]));
      setTimeout(() => {
        inputNewLessonRef.current?.focus();
      }, 300);
    }
  }, [menuState.isOpen, newLesson]);

  const { courseId } = useEditCourseContext();
  const { renameSection, isPending } = useEditCurriculum({ courseId });
  const handleRenameSection = () => {
    if (!editSection || !editSection.title || !editSection.id) return;
    return renameSection({ courseId, sectionId: editSection.id, title: editSection.title });
  };
  useNProgress(hasTrue(isPending));

  return (
    <li
      {...(editMode && { ...listeners, ...attributes })}
      data-section-sortable={section.id}
      ref={setNodeRef}
      style={style}
      className="list-none"
      role="treeitem"
      aria-expanded={expanded.has(section.id!)}
      aria-selected={expanded.has(section.id!)}
      tabIndex={-1}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) setEditSection(null);
      }}>
      <span
        className={cn(
          "flex w-full items-center gap-2 rounded-lg text-left transition-colors duration-150 cursor-pointer",
          "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]",
          editSection == null ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]"
        )}
        onClick={handleToggle}>
        <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center")}>
          {expanded.has(section.id!) ? <IoChevronDown /> : <IoChevronForward />}
        </span>
        {editMode && <Checkbox radius="sm" size="sm" className="-mr-4" />}
        {editSection?.id === section.id ? (
          <span className="w-full flex pr-[3px]">
            <input
              ref={inputSectionRef}
              type="text"
              className="w-full border text-sm px-1 py-1 bg-gray-100 border-gray-300 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-md"
              onClick={e => e.stopPropagation()}
              value={editSection?.title}
              onChange={e => e.target.value && setEditSection({ id: section.id!, title: e.target.value })}
              onFocus={() => inputSectionRef.current?.select()}
              onKeyDown={e => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  return handleRenameSection();
                }
              }}
            />
            <Button
              onPress={handleRenameSection}
              variant="flat"
              color="primary"
              isIconOnly
              className="reset-button p-2 rounded-md ml-1"
              size="sm"
              radius="none">
              <LuCheck />
            </Button>
          </span>
        ) : (
          <Fragment>
            <span className="flex-1 truncate text-sm font-medium text-left">{section.title}</span>
            {editMode ? (
              <span className="text-left py-1 px-0.5">
                <LuChevronsUpDown size={16} />
              </span>
            ) : (
              <Popover state={menuState} triggerType="listbox" placement="bottom-start" radius="sm">
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
                  <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
                    <ListboxItem onPress={() => setNewLesson("New Lesson")} startContent={<LuPlus />} key="new">
                      New lesson
                    </ListboxItem>
                    <ListboxItem
                      onPress={() => setEditSection({ id: section.id!, title: section.title })}
                      startContent={<LuPencil />}
                      key="edit">
                      Rename
                    </ListboxItem>
                    <ListboxItem
                      onPress={() => onRemove(section.id!, section.title)}
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
          </Fragment>
        )}
      </span>

      {expanded.has(section.id!) ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrag}>
          <ul
            className="mt-1 ml-4 flex list-none flex-col gap-1 border-l border-[var(--tt-border-color)] px-3"
            role="group">
            <SortableContext strategy={verticalListSortingStrategy} items={ids}>
              {fields.map(lesson => (
                <CourseLessonItem lesson={lesson} onSelect={onSelect} section={section} key={lesson.id} />
              ))}
            </SortableContext>
            {newLesson && (
              <li className="list-none" role="treeitem" aria-selected={false}>
                <span
                  className={
                    "flex w-full items-center gap-1 rounded-lg pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150 cursor-pointer hover:bg-[var(--tt-gray-light-a-100)] py-[3px] pr-[3px]"
                  }>
                  <span className="block h-4 w-4 shrink-0 rounded-full" />
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
                    <LuFilePlus2 />
                  </span>
                  <input
                    type="text"
                    name="new lesson"
                    className={cn(
                      "w-full border text-sm px-1 py-1 focus:outline-0 text-[var(--tt-theme-text)] rounded-md",
                      "bg-gray-100 border-gray-300"
                    )}
                    ref={inputNewLessonRef}
                    onBlur={() => setNewLesson(null)}
                    value={newLesson || undefined}
                    onChange={e => setNewLesson(e.target.value)}
                    onFocus={() => inputNewLessonRef.current?.select()}
                  />
                  <Button
                    onPress={() => setNewLesson(null)}
                    variant="flat"
                    color="primary"
                    isIconOnly
                    className="reset-button p-2 rounded-md"
                    size="sm"
                    radius="none">
                    <LuCheck />
                  </Button>
                </span>
              </li>
            )}
            {section.lessons?.length == 0 && newLesson == null ? (
              <li role="treeitem" aria-selected={false} className="list-none">
                <span
                  className={
                    "flex w-full items-center gap-1 rounded-lg pl-3 text-left text-[var(--tt-theme-text-muted)] transition-colors duration-150 py-1.5 px-2"
                  }>
                  <span className="block h-4 w-4 shrink-0 rounded-full" />
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-brand-color-600)]">
                    <LuFileX />
                  </span>
                  <p className="text-sm">No lesson found</p>
                </span>
              </li>
            ) : null}
          </ul>
        </DndContext>
      ) : null}
    </li>
  );
};
export default CourseSectionItem;
