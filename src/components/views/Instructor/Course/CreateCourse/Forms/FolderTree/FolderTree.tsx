import cn from "@/libs/utils/cn";
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
import { Button } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { LuCheck, LuListPlus } from "react-icons/lu";
import { CourseForm } from "../../form.type";
import CourseSectionItem from "./SectionItem/SectionItem";

type ToggleSelect = (id: string) => void;

export type FolderTreeProps = {
  newSectionState: StateType<string | null>;
  selectState: StateType<Set<string>>;
  expandedState: StateType<Set<string>>;
  fieldArray: UseFieldArrayReturn<CourseForm, "sections", "id">;
};

export default function FolderTree({
  expandedState,
  newSectionState: [newSection, setNewSection],
  selectState: [selected, setSelected],
  fieldArray: { append, fields, move, update, remove },
}: FolderTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = useMemo(() => fields.map(s => s.id!), [fields]);
  const [dragState, setDragState] = useState<{ id: string; width: number; height: number; expanded: boolean } | null>(
    null,
  );
  function handleDragStart({ active }: DragStartEvent) {
    if (!active) return;
    const element = document.querySelector<HTMLElement>(`[data-section-sortable="${active.id}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setDragState({
        width: rect.width,
        height: rect.height,
        expanded: element.getAttribute("aria-expanded") == "true",
        id: active.id.toString(),
      });
    }
  }

  const inputNewSectionRef = useRef<HTMLInputElement>(null);

  const handleAddSection = () => {
    if (newSection) {
      append({ title: newSection });
      setNewSection(null);
    }
  };
  useEffect(() => {
    if (newSection && inputNewSectionRef.current) {
      inputNewSectionRef.current.focus();
    }
  }, [newSection]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragState(null);
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

  const onRename = (idx: number, title: string) => update(idx, { title });
  const onRemove = (idx: number) => remove(idx);

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
              key={section.id}
              onCheck={() => toggleSelect(section.id!)}
              isChecked={selected.has(section.id!)}
              {...{ section, idx, expandedState, onRename, onRemove }}
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
                    handleAddSection();
                  }
                  if (e.key == "Escape") {
                    e.preventDefault();
                    setNewSection(null);
                  }
                }}
              />
              <Button
                onPress={handleAddSection}
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
      {dragState && (
        <DragOverlay>
          <div style={{ width: dragState.width, height: dragState.height, opacity: 0.6 }}>
            <CourseSectionItem
              idx={fields.findIndex(f => f.id == dragState.id)}
              key={dragState.id}
              section={fields.filter(f => f.id == dragState.id)[0]}
              expandedState={expandedState}
              isChecked={selected.has(dragState.id)}
            />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
}
