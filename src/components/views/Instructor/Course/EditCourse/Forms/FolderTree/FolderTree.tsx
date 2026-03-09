import * as React from "react";

import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { CourseSectionForm, EditCourseForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import useEditSection from "@/hooks/course/useEditSection";
import { useNProgress } from "@/hooks/use-nProgress";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { hasTrue } from "@/libs/utils/boolean";
import { StateType } from "@/types/Helper";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Spinner, cn } from "@heroui/react";
import { UseFieldArrayReturn } from "react-hook-form";
import { LuCheck, LuListPlus } from "react-icons/lu";
import CourseSectionItem from "./SectionItem";

export type OnSelect = (
  section: CourseSectionForm,
  lesson: NonNullable<CourseSectionForm["lessons"]>[number],
  path: string[],
) => void;
export type FolderTreeProps = {
  onSelect: OnSelect;
  newSectionState: StateType<string | null>;
  selectState: StateType<Set<number>>;
  expandedState: StateType<Set<number>>;
  defaultValue: CourseSection[];
  fieldArray: UseFieldArrayReturn<EditCourseForm, "sections", "fieldId">;
};
type ToggleSelect = (id: number) => void;
export const FolderTree: React.FC<FolderTreeProps> = ({
  expandedState,
  onSelect,
  newSectionState: [newSection, setNewSection],
  selectState: [selected, setSelected],
  defaultValue,
  fieldArray: { fields, move, replace },
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ids = React.useMemo(() => fields.map(s => s.id!), [fields]);
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const [dragState, setDragState] = React.useState({ width: 0, height: 0, expanded: false });
  function handleDragStart({ active }: DragStartEvent) {
    if (!active) return;
    setActiveId(active.id as number);

    const element = document.querySelector<HTMLElement>(`[data-section-sortable="${active.id}"]`);

    if (element) {
      const rect = element.getBoundingClientRect();
      setDragState({
        width: rect.width,
        height: rect.height,
        expanded: element.getAttribute("aria-expanded") == "true",
      });
    }
  }

  const inputNewSectionRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (newSection && inputNewSectionRef.current) {
      inputNewSectionRef.current.focus();
    }
  }, [newSection]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const from = fields.findIndex(s => s.id === active.id);
    const to = fields.findIndex(s => s.id === over.id);
    if (from === -1 || to === -1) return;
    move(from, to);
  };
  const toggleSelect: ToggleSelect = id => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { courseId, showPublished } = useEditCourseContext();

  const { createSection, removeSection, isPending } = useEditSection({
    onCreateSectionSuccess() {
      setNewSection(null);
    },
  });
  const removeSectionPendingRef = React.useRef(isPending.removeSectionPending);
  React.useEffect(() => {
    removeSectionPendingRef.current = isPending.removeSectionPending;
  }, [isPending.removeSectionPending]);

  const handleRemoveSection = (id: number, title: string) => {
    return confirmDialog({
      title: "Remove Section",
      desc: `This action will permananently delete "${title}" section`,
      isDestructive: true,
      onConfirmed() {
        removeSection({ courseId, sectionId: id });
      },
      isLoading: () => removeSectionPendingRef.current,
    });
  };

  const handleSubmitSection = () => {
    if (newSection == null) return;
    createSection({ courseId, sections: [newSection] });
  };

  useNProgress(hasTrue(isPending));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}>
      <ul className={cn("m-0 flex list-none flex-col gap-1 ")} role="tree">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {fields.map(
            (section, idx) =>
              ((showPublished && section.publishedAt) || !showPublished) && (
                <CourseSectionItem
                  idx={idx}
                  key={`${section.id}-${section.fieldId}`}
                  section={section}
                  onSelect={onSelect}
                  onRemove={handleRemoveSection}
                  expandState={expandedState}
                  onCheck={() => toggleSelect(section.id!)}
                  isChecked={selected.has(section.id!)}
                  defaultLessons={defaultValue.filter(s => s.id == section.id)[0]?.lessons ?? []}
                />
              ),
          )}
        </SortableContext>
        {newSection && (
          <li
            className="mt-1"
            tabIndex={-1}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setNewSection(null);
              }
            }}>
            <span
              className={cn(
                "flex w-full items-center rounded-lg text-left transition-colors duration-150 cursor-pointer",
                "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)] border-abu text-[var(--tt-theme-text)]",
                "pl-2 py-[3px] pr-[3px]",
              )}>
              <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center mr-2")}>
                <LuListPlus />
              </span>
              <input
                type="text"
                className="w-full border text-sm px-1 py-1 bg-gray-100 border-gray-300 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-md"
                ref={inputNewSectionRef}
                onClick={e => e.stopPropagation()}
                value={newSection || undefined}
                onChange={e => setNewSection(e.target.value)}
                onFocus={() => inputNewSectionRef.current?.select()}
                onKeyDown={e => {
                  if (e.key == "Enter") {
                    e.preventDefault();
                    handleSubmitSection();
                  }
                }}
              />
              <Button
                onPress={handleSubmitSection}
                variant="flat"
                color="primary"
                isIconOnly
                size="sm"
                disabled={isPending.createSectionPendig}
                className={cn("reset-button ml-1 rounded-md", isPending.createSectionPendig ? "p-0" : "p-2")}
                radius="none">
                {isPending.createSectionPendig ? (
                  <Spinner
                    classNames={{
                      circle1: "w-4 h-4 border-2",
                      circle2: "w-4 h-4 border-2",
                      wrapper: "w-7 h-7 p-0 m-0 items-center justify-center",
                    }}
                  />
                ) : (
                  <LuCheck />
                )}
              </Button>
            </span>
          </li>
        )}
      </ul>
      {activeId && (
        <DragOverlay>
          <div style={{ width: dragState.width, height: dragState.height, opacity: 0.6 }}>
            <CourseSectionItem
              idx={fields.findIndex(f => f.id == activeId)}
              key={activeId}
              section={fields.filter(f => f.id == activeId)[0]}
              onSelect={onSelect}
              expandState={expandedState}
              isChecked={selected.has(activeId)}
              defaultLessons={defaultValue.filter(s => s.id == activeId)[0].lessons}
            />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};
