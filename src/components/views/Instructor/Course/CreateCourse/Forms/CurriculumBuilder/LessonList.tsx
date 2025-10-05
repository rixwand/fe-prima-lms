"use client";

import TextField from "@/components/commons/TextField";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@heroui/react";
import { useMemo } from "react";
import { Controller, UseFormRegister, UseFormSetValue, useFieldArray, useFormContext } from "react-hook-form";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { CourseForm } from "../../CreateCourse";

export default function LessonListRHF({ sectionIndex, sectionId }: { sectionIndex: number; sectionId: string }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { control, setValue, register } = useFormContext<CourseForm>();
  const { fields, move, remove, append } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
  });

  const addLesson = () => append({ title: `New Lesson ${fields.length + 1}`, isPreview: false }, { shouldFocus: true });

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
        <p>No lessons yet.</p>
        <button
          onClick={() => addLesson()}
          className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm mt-2">
          <LuPlus className="w-4 h-4" /> Add Lesson
        </button>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-3 rounded-lg">
        <div className="md:col-span-6">
          <h3>Lesson Title</h3>
        </div>
        <div className="md:col-span-3">
          <h3>Duration (minute)</h3>
        </div>
        <div className="md:col-span-3">
          <h3>Mark as preview</h3>
        </div>
      </div>
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
      <div>
        <button
          onClick={() => addLesson()}
          className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
          <LuPlus className="w-4 h-4" /> Add Lesson
        </button>
      </div>
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

function SortableItem({ id, sectionId, removeLesson, titlePath, durationPath, isPreviewPath, register }: Props) {
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
            rules={{ required: "please input lesson title" }}
            render={({ field, fieldState: { error } }) => (
              <TextField field={field} id={titlePath} error={error?.message} />
            )}
          />
        </div>
        <div className="md:col-span-3">
          <Controller
            control={control}
            name={durationPath}
            render={({ field, fieldState: { error } }) => {
              const minutes = typeof field.value === "number" ? String(Math.floor(field.value / 60)) : "";

              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value;
                if (raw === "") {
                  field.onChange(undefined); // allow empty
                  return;
                }
                const n = Number(raw);
                if (Number.isNaN(n)) {
                  field.onChange(undefined);
                  return;
                }
                field.onChange(n * 60); // store seconds
              };
              return (
                <TextField
                  {...field}
                  id={durationPath}
                  error={error?.message}
                  type="number"
                  onChange={handleChange}
                  value={minutes}
                  placeholder="0 min"
                />
              );
            }}
          />
        </div>
        <div className="md:col-span-3 flex items-center gap-2">
          <Switch {...register(isPreviewPath)} size="sm" />
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
