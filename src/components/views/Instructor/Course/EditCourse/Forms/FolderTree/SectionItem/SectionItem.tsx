import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import useModalAddLessons from "@/components/commons/Forms/AddLessonsForm/useModalAddLesson";
import NormalCkbox from "@/components/commons/NormalCkbox";
import { OnSelect } from "@/components/views/Instructor/Course/EditCourse/Forms/FolderTree/FolderTree";
import CourseLessonItem from "@/components/views/Instructor/Course/EditCourse/Forms/FolderTree/SectionItem/LessonItem";
import { CourseSectionForm, EditCourseForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import useEditLessonList from "@/hooks/course/useEditLessonsList";
import useEditSection from "@/hooks/course/useEditSection";
import { useNProgress } from "@/hooks/use-nProgress";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { useFolderTreeContext } from "@/libs/context/FolderTreeContext";
import { hasTrue } from "@/libs/utils/boolean";
import cn from "@/libs/utils/cn";
import { diffList } from "@/libs/utils/data";
import { StateType } from "@/types/Helper";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, addToast } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { CSSProperties, FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import {
  LuCheck,
  LuChevronsUpDown,
  LuCopyPlus,
  LuEllipsisVertical,
  LuFilePlus2,
  LuFileX,
  LuPencilLine,
  LuPencilOff,
  LuPlus,
  LuSquarePen,
  LuTrash2,
} from "react-icons/lu";
const CourseSectionItem: FC<{
  section: CourseSectionForm;
  onSelect: OnSelect;
  expandState: StateType<Set<number>>;
  idx: number;
  overlay?: boolean;
  onRemove?: (id: number, title: string) => void;
  onCheck?: () => void;
  isChecked: boolean;
  defaultLessons: CourseSection["lessons"];
}> = ({
  section,
  onSelect,
  expandState: [expanded, setExpanded],
  idx,
  onRemove = () => {},
  onCheck = () => {},
  isChecked,
  defaultLessons,
}) => {
  const { editMode } = useFolderTreeContext();
  const [editSection, setEditSection] = useState<{ id: number; title: string } | null>(null);
  const [isEditLesson, setEditLesson] = useState(false);

  useEffect(() => {
    if (editMode) setEditLesson(false);
  }, [editMode]);

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
  const { control, getValues, setValue } = useFormContext<EditCourseForm>();
  const idIdx = getValues("sections")!.findIndex(s => s.id == section.id);
  const { fields, move, replace } = useFieldArray({
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

  const { courseId, showPublished } = useEditCourseContext();
  const { renameSection, isPending } = useEditSection({});
  const handleRenameSection = () => {
    if (!editSection || !editSection.title || !editSection.id)
      return addToast({
        title: "Error",
        description: "Section title must be not empty",
        color: "danger",
      });
    if (editSection.title.trim() == section.title.trim()) return setEditSection(null);
    return renameSection({ courseId, sectionId: editSection.id, title: editSection.title });
  };

  const [selectedLesson, setSelectedLesson] = useState<Set<number>>(new Set());
  useEffect(() => {
    if (isChecked) {
      setSelectedLesson(new Set(ids));
    } else {
      setSelectedLesson(new Set());
    }
  }, [isChecked, ids]);

  const toggleSelect = (id: number) => {
    setSelectedLesson(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { createLessons, isLoading, queryLessons, reorderLessons, batchRemoveLesson } = useEditLessonList({
    sectionId: section.id!,
    onCreateLessonSuccess() {
      setNewLesson(null);
    },
    onReorderLessonSuccess() {
      setEditLesson(false);
    },
    onBatchRemoveLessonSuccess() {
      setEditLesson(false);
    },
  });

  useEffect(() => {
    if (queryLessons) {
      setValue(`sections.${idIdx}.lessons`, queryLessons);
    }
  }, [queryLessons]);

  const handleSubmitLesson = () => {
    if (!newLesson) return;
    return createLessons([{ title: newLesson }]);
  };
  const handleSubmitReorderLesson = () => {
    const base = queryLessons || defaultLessons;
    const changes = fields.map(({ fieldId: _fId, position: _pos, ...v }, i) => ({ position: i + 1, ...v }));
    const reorderList = diffList(base, changes as Lesson[], { props: ["position"] });
    if (reorderList.length == 0) return setEditLesson(false);
    return reorderLessons(reorderList);
  };

  const handleCancelReorder = () => {
    setEditLesson(false);
    replace(defaultLessons);
  };

  const handleToggleAllSelectedLesson = (v: boolean) => {
    if (v) setSelectedLesson(new Set([...ids]));
    else setSelectedLesson(new Set());
  };

  const handleBatchRemoveLessons = () => {
    if (selectedLesson.size == 0) return;
    return confirmDialog({
      title: "Remove Lessons ?",
      desc: `This action will permananently remove ${selectedLesson.size} lesson${selectedLesson.size > 1 ? "s" : ""}`,
      isLoading: isLoading.batchRemoveLessonPending,
      onConfirmed: () => batchRemoveLesson([...selectedLesson]),
    });
  };

  const { opneAddLessonModal } = useModalAddLessons({ createLessons });
  useNProgress(hasTrue(isPending) || hasTrue(isLoading));

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
          editSection == null ? "py-1.5 px-2" : "pl-2 py-[3px] pr-[3px]",
          isEditLesson && "border border-blue-300 py-[5px]",
        )}
        onClick={isEditLesson ? () => {} : handleToggle}>
        <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center")}>
          {expanded.has(section.id!) ? <IoChevronDown /> : <IoChevronForward />}
        </span>
        {editMode && (
          <NormalCkbox
            className="p-0"
            isSelected={isChecked}
            onValueChange={onCheck}
            onClick={e => e.stopPropagation()}
          />
        )}
        {isEditLesson && (
          <NormalCkbox
            className="p-0"
            isSelected={ids.every(id => selectedLesson.has(id))}
            onValueChange={handleToggleAllSelectedLesson}
            onClick={e => e.stopPropagation()}
          />
        )}
        {editSection?.id === section.id ? (
          <span className="w-full flex pr-[3px]">
            <input
              ref={inputSectionRef}
              type="text"
              className="w-full border text-sm px-1 py-1 bg-gray-100 border-gray-300 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-md"
              onClick={e => e.stopPropagation()}
              value={editSection?.title}
              onChange={e => setEditSection({ id: section.id!, title: e.target.value })}
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
            ) : isEditLesson ? (
              <span className="flex gap-x-3 mr-1">
                <Button
                  isIconOnly
                  onPress={handleSubmitReorderLesson}
                  hidden={!isEditLesson}
                  radius="none"
                  size="lg"
                  className={cn("reset-button p-[5px] text-sm rounded-md")}
                  color="primary"
                  variant={"flat"}>
                  <LuCheck />
                </Button>
                <Button
                  isIconOnly
                  onPress={handleBatchRemoveLessons}
                  hidden={!isEditLesson}
                  radius="none"
                  size="lg"
                  className={cn("reset-button p-[5px] text-sm rounded-md")}
                  color="danger"
                  variant={"flat"}>
                  <LuTrash2 />
                </Button>
                <Button
                  isIconOnly
                  onPress={handleCancelReorder}
                  radius="none"
                  size="lg"
                  className={cn("reset-button p-[5px] text-sm rounded-md")}
                  hidden={!isEditLesson}
                  variant="flat"
                  color="warning">
                  <LuPencilOff />
                </Button>
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
                <PopoverContent className="p-2 w-44">
                  <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
                    <ListboxItem onPress={() => setNewLesson("New Lesson")} startContent={<LuPlus />} key="new">
                      New lesson
                    </ListboxItem>
                    <ListboxItem onPress={opneAddLessonModal} startContent={<LuCopyPlus />} key="new batch">
                      New lesson batch
                    </ListboxItem>
                    <ListboxItem
                      hidden={!section.lessons || section.lessons.length == 0}
                      onPress={() => {
                        setExpanded(v => new Set([...v, section.id!]));
                        setEditLesson(true);
                      }}
                      startContent={<LuSquarePen />}
                      key="edit lesson">
                      Edit Lesson
                    </ListboxItem>
                    <ListboxItem
                      onPress={() => setEditSection({ id: section.id!, title: section.title })}
                      startContent={<LuPencilLine />}
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
            className={cn(
              "ml-4 flex list-none flex-col gap-1 px-3",
              isEditLesson
                ? "border-blue-300 border-x border-b rounded-b-lg py-2 mr-1"
                : "border-l  border-[var(--tt-border-color)] mt-1",
            )}
            role="group">
            <SortableContext strategy={verticalListSortingStrategy} items={ids}>
              {fields.map(
                lesson =>
                  ((showPublished && lesson.publishedAt) || !showPublished) && (
                    <CourseLessonItem
                      isChecked={selectedLesson.has(lesson.id!)}
                      onCheck={() => toggleSelect(lesson.id!)}
                      lesson={lesson}
                      onSelect={onSelect}
                      section={section}
                      key={lesson.id}
                      editMode={isEditLesson}
                    />
                  ),
              )}
            </SortableContext>
            {newLesson && (
              <li
                className="list-none"
                role="treeitem"
                aria-selected={false}
                onBlur={e => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setNewLesson(null);
                  }
                }}>
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
                      "bg-gray-100 border-gray-300",
                    )}
                    ref={inputNewLessonRef}
                    value={newLesson || undefined}
                    onChange={e => setNewLesson(e.target.value)}
                    onFocus={() => inputNewLessonRef.current?.select()}
                    onKeyDown={e => {
                      if (e.key == "Enter") {
                        e.preventDefault();
                        handleSubmitLesson();
                      }
                      if (e.key == "Escape") setNewLesson(null);
                    }}
                  />
                  <Button
                    onPress={handleSubmitLesson}
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
            {fields?.length == 0 && newLesson == null ? (
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
