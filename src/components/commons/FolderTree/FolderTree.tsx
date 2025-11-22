import * as React from "react";

import { cn } from "@/lib/tiptap-utils";
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
import { useFieldArray, useFormContext } from "react-hook-form";
import CourseSectionItem from "./SectionItem";

export type CourseSectionForm = NonNullable<CourseForm["sections"]>[number];
export type OnSelect = (
  section: CourseSectionForm,
  lesson: CourseSectionForm["lessons"][number],
  path: string[]
) => void;
export type FolderTreeProps = {
  activeLessonId?: number | null;
  onSelect: OnSelect;
};

export const FolderTree: React.FC<FolderTreeProps> = ({ activeLessonId, onSelect }) => {
  const { control, reset } = useFormContext<CourseForm>();
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
              key={section.id}
              section={section}
              activeLessonId={activeLessonId}
              onSelect={onSelect}
            />
          ))}
        </SortableContext>
      </ul>
      {activeId && (
        <DragOverlay>
          <div style={{ width: dragState.width, height: dragState.height, opacity: 0.6 }}>
            <CourseSectionItem
              idx={0}
              overlay={true}
              key={activeId}
              section={fields.filter(f => f.id == activeId)[0]}
              activeLessonId={activeLessonId}
              onSelect={onSelect}
              expanded={dragState.expanded}
            />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};
