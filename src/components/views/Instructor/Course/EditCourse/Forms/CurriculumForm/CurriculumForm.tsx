"use client";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import FolderTree from "@/components/commons/FolderTree";
import useModalAddSections from "@/components/commons/Forms/AddSectionsForm/useModalAddSections";
import NormalCkbox from "@/components/commons/NormalCkbox/NormalCkbox";
import { TiptapViewer } from "@/components/commons/TiptapViewer/TiptapViewer";
import useEditSection from "@/hooks/course/useEditSection";
import { useQueryBlocks } from "@/hooks/course/useLessonEditor";
import { useNProgress } from "@/hooks/use-nProgress";
import { useStickySentinel } from "@/hooks/use-sticky-shadow";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { FolderTreeContext, LessonPathIds } from "@/libs/context/FolderTreeContext";
import { hasTrue } from "@/libs/utils/boolean";
import cn from "@/libs/utils/cn";
import { diffList } from "@/libs/utils/data";
import { StateType } from "@/types/Helper";
import { Button } from "@heroui/react";
import { Content, JSONContent } from "@tiptap/core";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  LuCheck,
  LuChevronsDown,
  LuChevronsUp,
  LuCopyPlus,
  LuExternalLink,
  LuPencil,
  LuPencilOff,
  LuPlus,
  LuRotateCcw,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { CourseSectionForm, CurriculumFormProps, EditCourseForm } from "../form.type";

type SelectState = StateType<Set<number>>;
export default function CurriculumForm({ courseId, defaultValue }: CurriculumFormProps) {
  const { watch, getValues, reset } = useFormContext<EditCourseForm>();

  const sectionsValue = watch("sections");
  const isLessonEditorDisabled = useMemo(
    () =>
      !Array.isArray(sectionsValue) ||
      !sectionsValue.some(section => Array.isArray(section?.lessons) && section.lessons.length > 0),
    [sectionsValue]
  );

  const [activeLesson, setActiveLesson] = useState<LessonPathIds | null>(null);
  const [blockPreview, setBlockPreview] = useState<Content | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const selectState: SelectState = useState(new Set());
  const newSectionState = useState<string | null>(null);
  const {
    showCoursePreviewState: [showPreview, setShowCoursePreview],
  } = useEditCourseContext();
  const sections = watch("sections");
  const ids = useMemo(() => sections?.flatMap(s => s.id!), [sections]);
  const expandedState = useState(new Set(ids));

  const onSelect = (
    section: CourseSectionForm,
    lesson: NonNullable<CourseSectionForm["lessons"]>[number],
    path: string[]
  ) => {
    setActiveLesson({ path, ids: { sectionId: section.id!, lessonId: lesson.id!, courseId } });
  };

  useEffect(() => {
    if (activeLesson != null) {
      setShowCoursePreview(false);
    } else {
      setShowCoursePreview(true);
    }
  }, [activeLesson, setShowCoursePreview]);

  const handleExpandSections = () => {
    expandedState[1](new Set(ids));
  };
  const handleFoldSections = () => {
    expandedState[1](new Set());
  };

  const previewParentRef = useRef<HTMLDivElement | null>(null);
  const parentFormRef = useRef<HTMLDivElement | null>(null);

  const { setSentinelRef: sentinelPreviewRef, stuck: previewStuck } = useStickySentinel(previewParentRef);
  const { setSentinelRef: sentinelFormRef, stuck: formStuck } = useStickySentinel(parentFormRef);

  const { querySections, isPending, reorderSection, removeManySections } = useEditSection({
    onReorderSectionSuccess() {
      setEditMode(false);
    },
  });

  const resetSections = useCallback(() => {
    reset({ sections: querySections ? querySections.sections : defaultValue });
  }, [defaultValue, reset, querySections]);

  const handleSubmitReorder = () => {
    const sections = getValues("sections");
    if (!sections) return setEditMode(false);
    const base = querySections ? querySections.sections : defaultValue;
    const changes = sections.map(({ position: _, ...section }, i) => ({ position: i + 1, ...section }));
    const dirtyValue = diffList(base, changes as CourseSection[], { props: ["position"] });
    if (dirtyValue.length == 0) return setEditMode(false);
    return reorderSection({ courseId, data: dirtyValue });
  };

  const handleDeleteSection = () => {
    if (selectState[0].size == 0) return;
    return confirmDialog({
      title: "Remove batch Sections",
      desc: `This action will permananently delete "${selectState[0].size}" section`,
      onConfirmed() {
        return removeManySections({ courseId, sectionIds: [...selectState[0]] });
      },
      isLoading: isPending.removeSectionPending,
    });
  };

  const { data: blocks, isLoading } = useQueryBlocks(activeLesson?.ids);

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      setBlockPreview(blocks[0].textJson);
    } else {
      setBlockPreview(undefined);
    }
  }, [blocks]);

  const { openAddSectionsModal } = useModalAddSections();

  useNProgress(hasTrue(isPending) || isLoading);

  return (
    <section
      className={cn("grid @container gap-5", !showPreview ? "grid-cols-1 @[64.5rem]:grid-cols-12" : "grid-cols-1")}>
      <form className="space-y-4 @5xl:col-span-7">
        <div
          ref={parentFormRef}
          className={cn(
            editMode ? "border-blue-400 shadow-blue-300" : "border-slate-200",
            "rounded-xl border shadow-sm flex flex-col @container max-h-[calc(100vh-190px)] overflow-y-scroll bg-white scrollbar-hide"
          )}>
          <div className="w-full h-1" ref={sentinelFormRef} />
          <div
            className={cn(
              "space-y-3 sticky top-0 pt-5 px-6 pb-3 z-50 bg-white",
              formStuck && `shadow-sm`,
              editMode && "shadow-blue-100"
            )}>
            <div className="flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
              <header className="flex flex-col gap-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Curriculum Builder</h3>
                <p className="text-sm text-slate-500">Organize sections and lessons for your course.</p>
              </header>
              <Link
                href={`/instructor/dashboard/edit-course/${courseId}/curriculum`}
                aria-disabled={isLessonEditorDisabled}
                tabIndex={isLessonEditorDisabled ? -1 : undefined}
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-slate-700 transition",
                  isLessonEditorDisabled ? "pointer-events-none opacity-60 cursor-not-allowed" : "hover:bg-slate-50"
                )}>
                <LuExternalLink className="w-4 h-4" />
                Lesson Editor
              </Link>
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
              <Button
                onPress={resetSections}
                isIconOnly
                radius="sm"
                size="lg"
                hidden={!editMode}
                className="reset-button p-2 z-10 ml-[1px]"
                color="primary"
                variant="light">
                <LuRotateCcw size={18} />
              </Button>
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
                  onPress={handleSubmitReorder}
                  hidden={!editMode}
                  radius="sm"
                  size="lg"
                  className={cn("reset-button p-2")}
                  color="primary"
                  variant={"flat"}>
                  <LuCheck />
                </Button>
                <Button
                  isIconOnly
                  onPress={handleDeleteSection}
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
                  {...(editMode ? { color: "warning", variant: "flat" } : { color: "primary", variant: "light" })}
                  // color="primary"
                  // variant={editMode ? "solid" : "light"}
                >
                  {editMode ? <LuPencilOff /> : <LuPencil />}
                </Button>
              </span>
            </div>
          </div>
          {/* <CurriculumBuilder /> */}
          {getValues("sections") && (
            <FolderTreeContext.Provider value={{ editMode, activeLesson, setActiveLesson }}>
              <div className={"px-6 pb-6"}>
                <FolderTree
                  onSelect={onSelect}
                  newSectionState={newSectionState}
                  selectState={selectState}
                  expandedState={expandedState}
                  defaultValue={defaultValue}
                />
              </div>
            </FolderTreeContext.Provider>
          )}
        </div>
      </form>
      {/* Lesson Preview */}
      {!showPreview && activeLesson && (
        <div
          ref={previewParentRef}
          className={cn(
            "@5xl:col-span-5 @5xl:-mt-20 @5xl:max-h-[calc(100vh-110px)] @5xl:overflow-y-scroll",
            "rounded-xl border bg-white border-slate-200 shadow-sm",
            "relative scrollbar-hide"
          )}>
          <div ref={sentinelPreviewRef} className="h-1 w-full" />
          <div
            className={cn(
              "py-2 flex items-center text-sm font-medium px-5 w-full bg-white z-50 text-slate-700 sticky top-0 rounded-t-xl transition-all duration-300",
              previewStuck && "shadow-xs"
            )}>
            <p className="truncate min-w-0">
              {activeLesson.path.join(" / ")} <span className="text-slate-400 ml-2 italic">(preview)</span>
            </p>
            <Button
              onPress={() => setActiveLesson(null)}
              isIconOnly
              variant="light"
              radius="sm"
              className="reset-button text-lg text-slate-600 ml-auto -mr-2 p-1.5">
              <LuX />
            </Button>
          </div>
          <TiptapViewer json={(blockPreview as JSONContent) || { type: "doc", content: [] }} />
        </div>
      )}
    </section>
  );
}
