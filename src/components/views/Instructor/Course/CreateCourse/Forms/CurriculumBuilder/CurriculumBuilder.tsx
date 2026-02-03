"use client";
import useModalAddSections from "@/components/commons/Forms/AddSectionsForm/useModalAddSections";
import NormalCkbox from "@/components/commons/NormalCkbox/NormalCkbox";
import FolderTree from "@/components/views/Instructor/Course/CreateCourse/Forms/FolderTree";
import { useStickySentinel } from "@/hooks/use-sticky-shadow";
import { FolderTreeContext, LessonPathIds } from "@/libs/context/FolderTreeContext";
import cn from "@/libs/utils/cn";
import { StateType } from "@/types/Helper";
import { Button } from "@heroui/react";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuChevronsDown, LuChevronsUp, LuCopyPlus, LuPencil, LuPencilOff, LuPlus, LuTrash2 } from "react-icons/lu";
import { CourseForm } from "../../form.type";

type SelectState = StateType<Set<string>>;
export default function CurriculumBuilder() {
  const { control } = useFormContext<CourseForm>();
  const [activeLesson, setActiveLesson] = useState<LessonPathIds | null>(null);

  const [editMode, setEditMode] = useState(false);
  const selectState: SelectState = useState(new Set());
  const newSectionState = useState<string | null>(null);
  const fieldArray = useFieldArray({ control, name: "sections", keyName: "id" });
  const ids = useMemo(() => fieldArray.fields?.flatMap(s => s.id!), [fieldArray.fields]);
  const expandedState = useState(new Set(ids));
  const [expanded, setExpanded] = expandedState;
  const [selected, setSelected] = selectState;
  const { fields, remove, append } = fieldArray;

  const handleExpandSections = () => {
    setExpanded(new Set(ids));
  };
  const handleFoldSections = () => {
    setExpanded(new Set());
  };

  const parentFormRef = useRef<HTMLDivElement | null>(null);

  const { setSentinelRef: sentinelFormRef, stuck: formStuck } = useStickySentinel(parentFormRef);

  const { openAddSectionsModal } = useModalAddSections({
    createSection({ sections }) {
      append(sections.map(s => ({ title: s })));
    },
  });

  const handleDeleteSections = () => {
    if (selected.size > 0) {
      const idxs = fields.map(({ id }, idx) => (selected.has(id) ? idx : null)).filter((f): f is number => f !== null);
      remove(idxs);
    }
  };

  return (
    <section className={cn("grid @container gap-5", "grid-cols-1 @[64.5rem]:grid-cols-12")}>
      <form className="space-y-4 @5xl:col-span-7">
        <div
          ref={parentFormRef}
          className={cn(
            "rounded-xl flex flex-col @container min-h-[16.5rem] max-h-[calc(100vh-190px)] overflow-y-scroll bg-white scrollbar-hide",
          )}>
          <div className="w-full h-1" ref={sentinelFormRef} />
          <div
            className={cn(
              "space-y-3 sticky top-0 z-50 bg-white mb-3",
              formStuck && `shadow-sm`,
              editMode && "shadow-blue-100",
            )}>
            <div className="flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
              <header className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Curriculum Builder</h3>
                <p className="text-sm text-slate-500">Organize sections and lessons for your course.</p>
              </header>
            </div>
            <div className="flex -mb-1 pr-4 relative items-center">
              <Button
                onPress={handleExpandSections}
                isIconOnly
                radius="sm"
                size="lg"
                className="reset-button p-2"
                color="primary"
                variant="light">
                <LuChevronsDown size={18} />
              </Button>
              <Button
                onPress={handleFoldSections}
                isIconOnly
                radius="sm"
                size="lg"
                className="reset-button p-2"
                color="primary"
                variant="light">
                <LuChevronsUp size={18} />
              </Button>
              {editMode && (
                <NormalCkbox
                  className="p-0 px-2"
                  onValueChange={() => {
                    selectState[1](prev => {
                      const next = new Set(prev);
                      const allChecked = ids!.every(id => next.has(id));
                      if (allChecked) return new Set();
                      return new Set(ids);
                    });
                  }}
                  isSelected={ids!.every(id => selectState[0].has(id))}
                />
              )}
              <span className={cn("ml-auto", editMode ? "space-x-3" : "space-x-1")}>
                <Button
                  onPress={() => newSectionState[1]("New Section")}
                  isIconOnly
                  radius="sm"
                  size="lg"
                  className="reset-button p-[7px]"
                  color="primary"
                  hidden={editMode}
                  variant="light">
                  <LuPlus size={18} />
                </Button>
                <Button
                  isIconOnly
                  onPress={openAddSectionsModal}
                  radius="sm"
                  size="lg"
                  className="reset-button p-2"
                  color="primary"
                  hidden={editMode}
                  variant="light">
                  <LuCopyPlus size={18} />
                </Button>
                <Button
                  isIconOnly
                  onPress={handleDeleteSections}
                  hidden={!editMode}
                  radius="sm"
                  size="lg"
                  className={cn("reset-button p-2")}
                  color="danger"
                  variant={"flat"}>
                  <LuTrash2 />
                </Button>
                <Button
                  isIconOnly
                  onPress={() => {
                    setEditMode(mode => !mode);
                    selectState[1](new Set());
                  }}
                  radius="sm"
                  size="lg"
                  className={cn("reset-button p-2")}
                  color="primary"
                  variant={editMode ? "flat" : "light"}>
                  {editMode ? <LuPencilOff /> : <LuPencil />}
                </Button>
              </span>
            </div>
          </div>
          {/* <CurriculumBuilder /> */}
          {fieldArray.fields.length > 0 || newSectionState[0] ? (
            <FolderTreeContext.Provider value={{ editMode, activeLesson, setActiveLesson }}>
              <FolderTree
                newSectionState={newSectionState}
                selectState={selectState}
                expandedState={expandedState}
                fieldArray={fieldArray}
              />
            </FolderTreeContext.Provider>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-600 mb-4">No sections yet. Organize your lessons into sections.</p>
              <button
                onClick={() => newSectionState[1]("New Section")}
                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium">
                <LuPlus className="w-4 h-4" /> Add Section
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
