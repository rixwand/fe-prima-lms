import * as React from "react";

import useEditCurriculum from "@/components/views/Instructor/Course/EditCourse/Forms/CurriculumForm/useEditCurriculum";
import { CourseSectionForm, EditCourseForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { useNProgress } from "@/hooks/use-nProgress";
import { cn } from "@/lib/tiptap-utils";
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
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@heroui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuCheck, LuListPlus } from "react-icons/lu";
import { confirmDialog } from "../Dialog/confirmDialog";
import CourseSectionItem from "./SectionItem";

export type OnSelect = (
  section: CourseSectionForm,
  lesson: NonNullable<CourseSectionForm["lessons"]>[number],
  path: string[]
) => void;
export type FolderTreeProps = {
  activeLessonId?: number | null;
  onSelect: OnSelect;
  newSectionState: StateType<string | null>;
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  activeLessonId,
  onSelect,
  newSectionState: [newSection, setNewSection],
}) => {
  const { control, reset } = useFormContext<EditCourseForm>();
  const { fields, append, remove, move, update } = useFieldArray({ control, name: "sections", keyName: "fieldId" });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const ids = React.useMemo(() => fields.map(s => s.id!), [fields]);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [dragState, setDragState] = React.useState({ width: 0, height: 0, expanded: false });
  const expandedState = React.useState(new Set(fields.flatMap(f => f.id!)));
  function handleDragStart({ active }: DragStartEvent) {
    if (!active) return;
    setActiveId(active.id);

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
    const snapshot = [...fields];

    update(from, { ...snapshot[from], position: to + 1 });

    if (from > to) {
      for (let i = to; i < from; i++) {
        const v = snapshot[i];
        update(i, { ...v, position: (v.position ?? i + 1) + 1 });
      }
    } else if (from < to) {
      for (let i = from + 1; i <= to; i++) {
        const v = snapshot[i];
        update(i, { ...v, position: (v.position ?? i + 1) - 1 });
      }
    }

    move(from, to);
  };

  const { courseId } = useEditCourseContext();

  const { createSection, querySections, removeSection, isPending } = useEditCurriculum({
    courseId,
    onCreateSectionSuccess() {
      setNewSection(null);
    },
  });

  const handleRemoveSection = (id: number, title: string) => {
    return confirmDialog({
      title: "Remove Sections",
      desc: `This action will permananently delete "${title}" section`,
      onConfirmed() {
        removeSection({ courseId, sectionId: id });
      },
      isLoading: isPending.removeSectionPending,
    });
  };

  const handleSubmitSection = () => {
    if (newSection == null) return;
    createSection({ courseId, sections: [newSection] });
  };

  useNProgress(hasTrue(isPending));

  React.useEffect(() => {
    if (querySections) reset({ sections: querySections?.sections.map(section => ({ ...section })) });
  }, [querySections, reset]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}>
      <ul className={cn("m-0 flex list-none flex-col gap-1 ")} role="tree">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {fields.map((section, idx) => (
            <CourseSectionItem
              idx={idx}
              key={`${section.id}-${section.fieldId}`}
              section={section}
              onSelect={onSelect}
              onRemove={handleRemoveSection}
              expandState={expandedState}
            />
          ))}
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
                "pl-2 py-[3px] pr-[3px]"
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
                className="reset-button p-2 ml-1 rounded-md"
                size="sm"
                radius="none">
                <LuCheck />
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
            />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};
