import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Accordion, AccordionItem } from "@heroui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import {
  LuCheckCheck,
  LuChevronLeft,
  LuChevronsUpDown,
  LuDelete,
  LuPencilLine,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import LessonListRHF from "./LessonList";

export const SectionItem = () => {
  const { control, setValue, getValues, watch } = useFormContext<CourseForm>();
  const {
    fields: sectionFields,
    append: sectionsAppend,
    remove: sectionsRemove,
    move: sectionsMove,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const [idsOpened, setIdsOpened] = useState<Set<string>>(new Set(sectionFields.map(s => s.id)));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const toggleOne = (id: string) =>
    setIdsOpened(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addSection = () => {
    sectionsAppend({ title: `Section ${sectionFields.length + 1}`, lessons: [] }, { shouldFocus: true });
  };

  useEffect(() => {
    if (sectionFields && sectionFields.length > 0) {
      const newSection = sectionFields[sectionFields.length - 1];
      setIdsOpened(v => new Set([...v, newSection.id]));
    }
  }, [sectionsAppend, sectionFields]);

  const renameSection = (idx: number, title: string) => setValue(`sections.${idx}.title`, title, { shouldDirty: true });

  const onDragStart = ({ active }: DragStartEvent) => setActiveId((active?.id as string) ?? null);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const from = sectionFields.findIndex(s => s.id === active.id);
    const to = sectionFields.findIndex(s => s.id === over.id);
    if (from === -1 || to === -1) return;

    // Move in RHF (keeps form state + dirty flags)
    sectionsMove(from, to);

    // Optional: if you rely on `idsOpened` visual order, recompose Set to preserve which are open
    setIdsOpened(prev => new Set(Array.from(prev)));
  };

  const ids = useMemo(() => sectionFields.map(s => s.id), [sectionFields]);

  const clearAll = () => {
    // remove all sections
    for (let i = sectionFields.length - 1; i >= 0; i--) sectionsRemove(i);
    setIdsOpened(new Set());
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {sectionFields.length == 0 ? (
        <EmptySection addSection={addSection} />
      ) : (
        <Fragment>
          <div className="justify-between flex w-full px-5 pb-1">
            <button
              type="button"
              onClick={clearAll}
              className="flex px-3 py-1 rounded-lg border border-danger bouncy-button gap-1 cursor-pointer items-center">
              <LuTrash2 className="text-danger" />
              <p className="text-sm text-danger">Clear all</p>
            </button>
            <span className="flex gap-3 text-2xl text-slate-500">
              {/* expand/collapse all */}
              <button
                type="button"
                className="-rotate-90 text-xl cursor-pointer bouncy-button hover:text-slate-600"
                onClick={() => setIdsOpened(new Set(sectionFields.map(s => s.id)))}>
                <GoSidebarExpand />
              </button>
              <button
                type="button"
                className="-rotate-90 text-xl cursor-pointer bouncy-button hover:text-slate-600"
                onClick={() => setIdsOpened(new Set())}>
                <GoSidebarCollapse />
              </button>
            </span>
          </div>

          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <Accordion
              itemClasses={{ base: "shadow-sm border border-abu" }}
              variant="splitted"
              selectionMode="multiple"
              selectedKeys={idsOpened}>
              {sectionFields.map((section, idx) => {
                const sectionPath = `sections.${idx}` as const;
                return (
                  <AccordionItem
                    textValue={section.title}
                    key={section.id}
                    indicator={() => (
                      <button
                        type="button"
                        onClick={() => toggleOne(section.id)}
                        className="cursor-pointer align-middle hover:text-slate-500 active:text-slate-600 bouncy-button">
                        <LuChevronLeft className="text-xl" />
                      </button>
                    )}
                    title={
                      <SortableSectionTitle
                        sortableId={section.id}
                        titlePath={`${sectionPath}.title`}
                        onDelete={() => sectionsRemove(idx)}
                        onRename={t => renameSection(idx, t)}
                      />
                    }>
                    <div className="p-4 space-y-3 -mt-3 text-sm">
                      <LessonListRHF sectionIndex={idx} sectionId={section.id} />
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </SortableContext>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => addSection()}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium">
              <LuPlus className="w-4 h-4" /> Add Section
            </button>
          </div>
        </Fragment>
      )}

      {/* Drag overlay */}
      {/* If you want a custom overlay, you can add DragOverlay here similarly to your original code */}
    </DndContext>
  );
};

// ---------- Sortable Section Title ----------
function SortableSectionTitle({
  sortableId,
  titlePath,
  onDelete,
  onRename,
}: {
  sortableId: string;
  titlePath: `sections.${number}.title`;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const { control } = useFormContext<CourseForm>();
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: sortableId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  } as React.CSSProperties;

  return (
    <section style={style} ref={setNodeRef} className="flex w-full gap-3 items-center mr-3 align-middle">
      {/* Drag handle */}
      <button
        {...(isEdit ? {} : attributes)}
        {...(isEdit ? {} : listeners)}
        // type="button"
        onClick={e => e.stopPropagation()}
        className="cursor-grab"
        aria-label="Drag to reorder">
        <LuChevronsUpDown />
      </button>

      {/* Edit toggle */}
      <button
        type="button"
        className="cursor-pointer align-middle mb-[1px]"
        onClick={e => {
          e.stopPropagation();
          setIsEdit(v => !v);
          if (!isEdit) setTimeout(() => inputRef.current?.focus(), 0);
        }}>
        {isEdit ? <LuCheckCheck className="text-success text-lg" /> : <LuPencilLine className="text-primary" />}
      </button>

      {/* Title (controlled by RHF) */}
      <Controller
        control={control}
        name={titlePath}
        render={({ field }) =>
          isEdit ? (
            <input
              ref={inputRef}
              value={field.value}
              onChange={e => {
                field.onChange(e.target.value);
                onRename(e.target.value);
              }}
              onKeyDown={e => {
                // prevent Accordion from toggling on Space/Enter
                if (e.key === " " || e.key === "Enter") {
                  e.stopPropagation();
                  if (e.key === "Enter") setIsEdit(false);
                }
              }}
              onClick={e => e.stopPropagation()}
              className="flex-1 bg-transparent border-b border-slate-200 focus:border-slate-300 font-medium focus:outline-none mr-9"
            />
          ) : (
            <span>{field.value}</span>
          )
        }
      />

      {/* Delete */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="rounded-lg hover:text-rose-700 cursor-pointer text-rose-600 text-lg ml-auto align-middle">
        <LuDelete />
      </button>
    </section>
  );
}

export default SectionItem;

const EmptySection = ({ addSection }: { addSection: () => void }) => (
  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
    <p className="text-slate-600 mb-4">No sections yet. Organize your lessons into sections.</p>
    <button
      onClick={() => addSection()}
      className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium">
      <LuPlus className="w-4 h-4" /> Add Section
    </button>
  </div>
);
