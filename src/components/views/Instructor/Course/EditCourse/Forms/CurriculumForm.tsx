"use client";
import FolderTree from "@/components/commons/FolderTree";
import { CourseSectionForm } from "@/components/commons/FolderTree/FolderTree";
import { TiptapViewer } from "@/components/commons/TiptapViewer/TiptapViewer";
import content from "@/components/tiptap-templates/simple/data/content.json";
import { useStickySentinel } from "@/hooks/use-sticky-shadow";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { FolderTreeContext } from "@/libs/context/FolderTreeContext";
import cn from "@/libs/utils/cn";
import { Button, Checkbox } from "@heroui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import {
  LuCheck,
  LuChevronsDown,
  LuChevronsUp,
  LuExternalLink,
  LuPencil,
  LuPencilOff,
  LuPlus,
  LuRotateCcw,
  LuTrash2,
  LuX,
} from "react-icons/lu";

type CurriculumFormProps = {
  courseId: number;
  defaultValue: CourseSection[];
  refetch: () => Promise<QueryObserverResult>;
};

const mapSectionsToForm = (sections?: CourseSection[]): NonNullable<CourseForm["sections"]> =>
  (sections ?? []).map(section => ({
    id: section.id,
    title: section.title,
    position: section.position,
    lessons: (section.lessons ?? []).map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary ?? undefined,
      durationSec: lesson.durationSec ?? undefined,
      isPreview: lesson.isPreview,
      position: lesson.position,
    })),
  }));

const sanitizeFormSections = (sections: NonNullable<CourseForm["sections"]>) =>
  sections.map((section, sectionIndex) => ({
    ...section,
    title: section.title?.trim() || `Section ${sectionIndex + 1}`,
    position: sectionIndex + 1,
    lessons: (section.lessons ?? []).map((lesson, lessonIndex) => ({
      ...lesson,
      title: lesson.title?.trim() || `Lesson ${lessonIndex + 1}`,
      summary: lesson.summary?.trim() || undefined,
      durationSec: typeof lesson.durationSec === "number" ? lesson.durationSec : undefined,
      isPreview: Boolean(lesson.isPreview),
      position: lessonIndex + 1,
    })),
  }));

const toApiPayload = (sections: NonNullable<CourseForm["sections"]>) =>
  sections.map(section => ({
    id: section.sectionId,
    title: section.title,
    position: section.position,
    lessons: (section.lessons ?? []).map(lesson => ({
      id: lesson.lessonId,
      title: lesson.title,
      summary: lesson.summary ?? null,
      durationSec: lesson.durationSec ?? null,
      isPreview: Boolean(lesson.isPreview),
      position: lesson.position,
    })),
  }));

export default function CurriculumForm({ courseId, refetch, defaultValue }: CurriculumFormProps) {
  const defaultSections = useMemo(() => mapSectionsToForm(defaultValue), [defaultValue]);
  const methods = useFormContext<CourseForm>();

  // useEffect(() => {
  //   methods.reset({ sections: defaultSections });
  // }, [defaultSections, methods]);

  const sectionsValue = methods.watch("sections");
  const isLessonEditorDisabled = useMemo(
    () =>
      !Array.isArray(sectionsValue) ||
      !sectionsValue.some(section => Array.isArray(section?.lessons) && section.lessons.length > 0),
    [sectionsValue]
  );

  // const { mutateAsync: updateCurriculum, isPending } = useMutation({
  //   mutationFn: (payload: { sections: ReturnType<typeof toApiPayload> }) =>
  //     courseService.update({ id: courseId, data: payload }),
  //   onSuccess: async () => {
  //     addToast({ title: "Success", description: "Curriculum updated.", color: "success" });
  //     await refetch();
  //   },
  //   onError: error => {
  //     const err = error as Error;
  //     addToast({ title: "Error", description: err.message, color: "danger" });
  //   },
  // });

  // useEffect(() => {
  //   if (isPending) NProgress.start();
  //   else NProgress.done();
  // }, [isPending]);

  // const onSubmit = methods.handleSubmit(async values => {
  //   if (!values.sections || values.sections.length === 0) {
  //     addToast({
  //       title: "Curriculum incomplete",
  //       description: "Add at least one section before saving.",
  //       color: "warning",
  //     });
  //     return;
  //   }

  //   const sanitized = sanitizeFormSections(values.sections);
  //   const payload = toApiPayload(sanitized);
  //   await updateCurriculum({ sections: payload });
  //   methods.reset({ sections: sanitized });
  // });

  // const handleReset = () => methods.reset({ sections: defaultSections });
  // const {
  //   formState: { isDirty },
  // } = methods;

  const [activeLesson, setActiveLesson] = useState<CourseSectionForm["lessons"][number] | null>(null);
  const [activeLessonPath, setPathActiveLesson] = useState<Array<string> | null>(null);
  const [editMode, setEditMode] = useState(false);
  const expandSectionsState = useState<null | boolean>(true);
  const {
    showCoursePreviewState: [showPreview, setShowCoursePreview],
  } = useEditCourseContext();

  const onSelect = (_section: CourseSectionForm, lesson: CourseSectionForm["lessons"][number], path: string[]) => {
    setActiveLesson(lesson);
    setPathActiveLesson(path);
  };

  useEffect(() => {
    if (activeLesson != null) {
      setShowCoursePreview(false);
    } else {
      setShowCoursePreview(true);
    }
  }, [activeLesson, setShowCoursePreview]);

  const handleExpandSections = () => {
    expandSectionsState[1](true);
  };
  const handleFoldSections = () => {
    expandSectionsState[1](false);
  };

  useEffect(() => {
    console.log();
  }, [methods.reset]);

  const previewParentRef = useRef<HTMLDivElement | null>(null);
  const parentFormRef = useRef<HTMLDivElement | null>(null);

  const { setSentinelRef: sentinelPreviewRef, stuck: previewStuck } = useStickySentinel(previewParentRef);
  const { setSentinelRef: sentinelFormRef, stuck: formStuck } = useStickySentinel(parentFormRef);

  const reset = () => {
    methods.reset({ sections: [...defaultSections] });
  };

  return (
    <section
      className={cn("grid @container gap-5", !showPreview ? "grid-cols-1 @[64.5rem]:grid-cols-12" : "grid-cols-1")}>
      <FormProvider {...methods}>
        <form
          //  onSubmit={onSubmit}
          className="space-y-4 @5xl:col-span-7">
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
              <div className="flex -mb-1 pr-4 relative">
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
                {editMode && <Checkbox radius="sm" size="sm" className="ml-0.5" />}
                <Button
                  onPress={reset}
                  isIconOnly
                  radius="sm"
                  size="lg"
                  hidden={!editMode}
                  className="reset-button p-2 z-10 ml-1.5"
                  color="primary"
                  variant="light">
                  <LuRotateCcw size={18} />
                </Button>
                <span className={cn("ml-auto", editMode ? "space-x-3" : "space-x-1")}>
                  <Button
                    // onPress={handleFoldSections}
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
                    onPress={() => {
                      setEditMode(mode => !mode);
                    }}
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
                    onPress={() => {
                      // setEditMode(mode => !mode);
                    }}
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
            {methods.getValues("sections") && (
              <FolderTreeContext.Provider value={{ editMode, expandSectionsState, resetSections: reset }}>
                <div className={"px-6 pb-6"}>
                  <FolderTree onSelect={onSelect} activeLessonId={activeLesson?.id || null} />
                </div>
              </FolderTreeContext.Provider>
            )}
          </div>

          {/* <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-6 @container">
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
            <CurriculumBuilder />
            <div className="flex flex-col gap-3 @xl:flex-row @xl:items-center @xl:justify-end @xl:gap-4">
              <div className="flex flex-col gap-3 @xl:flex-row @xl:items-center @xl:gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isDirty || isPending}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                  <LuRefreshCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || isPending}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-white font-medium disabled:bg-blue-400">
                  {isPending ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSave className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>
          </div> */}
        </form>
      </FormProvider>
      {/* Lesson Preview */}
      {!showPreview && (
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
              "py-2 flex items-center text-sm font-medium px-5 w-full bg-white z-50 text-slate-700 sticky top-0 truncate rounded-t-xl transition-all duration-300",
              previewStuck && "shadow-xs"
            )}>
            <p>
              Section 1 / New Lesson 1 <span className="text-slate-400 ml-2 italic">(preview)</span>
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
          <TiptapViewer json={content} />
        </div>
      )}
    </section>
  );
}
