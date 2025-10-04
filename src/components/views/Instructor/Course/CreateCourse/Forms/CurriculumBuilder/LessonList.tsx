"use client";

import cn from "@/libs/utils/cn";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@heroui/react";
import { useMemo } from "react";
import { Controller, UseFormRegister, UseFormSetValue, useFieldArray, useFormContext } from "react-hook-form";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { CourseForm } from "../../CreateCourse";

export default function LessonListRHF({ sectionIndex, sectionId }: { sectionIndex: number; sectionId: string }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { control, setValue, register } = useFormContext<CourseForm>();
  const { fields, move, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
  });

  const ids = useMemo(() => fields.map(f => f.id), [fields]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const from = fields.findIndex(l => l.id === active.id);
    const to = fields.findIndex(l => l.id === over.id);
    if (from === -1 || to === -1) return;

    move(from, to); // RHF-aware reordering
  };

  const removeLesson = (_sectionId: string, lessonId: string) => {
    const idx = fields.findIndex(l => l.id === lessonId);
    if (idx !== -1) remove(idx);
  };

  if (fields.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600 text-center">
        No lessons yet.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        {fields.map(({ id }, idx) => (
          <SortableItem
            key={id}
            {...{
              sectionId,
              removeLesson,
              setValue,
              register,
              id,
              titlePath: `sections.${sectionIndex}.lessons.${idx}.title`,
              durationPath: `sections.${sectionIndex}.lessons.${idx}.durationSec`,
              isPreviewPath: `sections.${sectionIndex}.lessons.${idx}.isPreview`,
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

type Props = {
  id: string;
  sectionId: string;
  removeLesson: (sectionId: string, id: string) => void;
  register: UseFormRegister<CourseForm>;
  titlePath: `sections.${number}.lessons.${number}.title`;
  durationPath: `sections.${number}.lessons.${number}.durationSec`;
  isPreviewPath: `sections.${number}.lessons.${number}.isPreview`;
  setValue: UseFormSetValue<CourseForm>;
};

function SortableItem({
  id,
  sectionId,
  removeLesson,
  titlePath,
  durationPath,
  isPreviewPath,
  setValue,
  register,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;
  const { control } = useFormContext<CourseForm>();
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
      <div className="grid grid-cols-1 md:grid-cols-12 cursor-pointer gap-3 p-3 rounded-lg border border-slate-200">
        <div className="md:col-span-6">
          <Controller
            control={control}
            name={titlePath}
            render={({ field: { value } }) => (
              <input
                value={value}
                onChange={e => setValue(titlePath, e.target.value, { shouldDirty: true })}
                onKeyDown={e => {
                  if (e.key === " " || e.key === "Enter") e.stopPropagation();
                }}
                className={cn([
                  "w-full h-10 px-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500",
                ])}
              />
            )}
          />
        </div>
        <div className="md:col-span-3">
          <Controller
            control={control}
            name={durationPath}
            render={({ field: { value } }) => (
              <input
                type="number"
                min={0}
                value={value}
                onChange={e => setValue(durationPath, Number(e.target.value), { shouldDirty: true })}
                onKeyDown={e => {
                  if (e.key === " ") e.stopPropagation();
                }}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500"
                placeholder="min"
              />
            )}
          />
        </div>
        <div className="md:col-span-3 flex items-center gap-2">
          <Switch {...register(isPreviewPath)} size="sm" onChange={e => console.log(e.target.value)} />
          <div className="ml-auto flex items-center mr-2 justify-end gap-3">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                removeLesson(sectionId, id);
              }}
              className="p-1.5 rounded-lg hover:text-rose-700 cursor-pointer text-rose-600">
              <IoClose className="text-xl" />
            </button>
            <div className="text-slate-500">
              <HiOutlineMenuAlt4 className="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
