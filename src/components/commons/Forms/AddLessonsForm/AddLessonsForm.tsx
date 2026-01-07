import NormalCkbox from "@/components/commons/NormalCkbox/NormalCkbox";
import { cn } from "@/libs/tiptap/tiptap-utils";
import { StateType } from "@/types/Helper";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { AddLessonsFormRhf } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import NewLessonItem from "./NewLessonsItem";

export type RhfMethods = UseFormReturn<AddLessonsFormRhf>;
export type SelectState = StateType<Set<UniqueIdentifier>>;
export type ToggleSelect = (id: UniqueIdentifier) => void;
export default function AddLessonsForm({ rhfMethods: { control } }: { rhfMethods: RhfMethods }) {
  const { fields, move, append, remove: removeFields } = useFieldArray({ control, name: "lessons" });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  useEffect(() => {
    const el = document.querySelector(`input[data-new-lesson-id="${fields[0].id}"]`);
    if (el instanceof HTMLInputElement) {
      el.focus();
    }
  }, []);
  const handleDrag = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = fields.findIndex(s => s.id === active.id);
    const to = fields.findIndex(s => s.id === over.id);
    if (from === -1 || to === -1) return;
    move(from, to);
  };
  const ids: UniqueIdentifier[] = useMemo(() => fields.map(f => f.id), [fields]);
  const addLesson = () => {
    append({ title: "New Lesson" });
  };

  const [selected, setSelected]: SelectState = useState(new Set());
  const toggleSelect: ToggleSelect = id => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removes = () => {
    const idxs = fields.flatMap((f, idx) => (selected.has(f.id) ? [idx] : []));
    removeFields(idxs);
  };

  return (
    <DndContext autoScroll={false} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrag}>
      <div>
        <div className="flex relative mx-2">
          <Button
            onPress={addLesson}
            isIconOnly
            radius="sm"
            size="lg"
            className="reset-button p-[7px]"
            color="primary"
            variant="light">
            <LuPlus size={18} />
          </Button>
          <NormalCkbox
            onValueChange={() => {
              setSelected(prev => {
                const next = new Set(prev);
                const allChecked = ids.every(id => next.has(id));
                if (allChecked) return new Set();
                return new Set(ids);
              });
            }}
            isSelected={ids.every(id => selected.has(id))}
          />
          <span className={cn("ml-auto", "space-x-1")}>
            <Button
              isIconOnly
              onPress={removes}
              radius="sm"
              size="lg"
              className={cn("reset-button p-2")}
              color="danger"
              variant={"light"}>
              <LuTrash2 />
            </Button>
          </span>
        </div>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-y-2 p-2" role="tree">
            {fields.map(({ id }, idx) => (
              <NewLessonItem
                remove={() => removeFields(idx)}
                key={id}
                {...{ idx, control, id, selected, toggleSelect, addLesson }}
              />
            ))}
          </ul>
        </SortableContext>
      </div>
    </DndContext>
  );
}
