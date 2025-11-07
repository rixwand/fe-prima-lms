"use client";

import { FolderTree } from "@/components/layouts/SimpleEditorLayout/simple-editor-layout-folder-tree";
import NProgress from "@/libs/loader/nprogress-setup";
import cn from "@/libs/utils/cn";
import courseService from "@/services/course.service";
import { addToast } from "@heroui/react";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuExternalLink, LuLoader, LuRefreshCcw, LuSave } from "react-icons/lu";

type CurriculumFormProps = {
  courseId: number;
  sections?: CourseSection[];
  refetch: () => Promise<QueryObserverResult>;
};

const mapSectionsToForm = (sections?: CourseSection[]): NonNullable<CourseForm["sections"]> =>
  (sections ?? []).map(section => ({
    sectionId: section.id,
    title: section.title,
    position: section.position,
    lessons: (section.lessons ?? []).map(lesson => ({
      lessonId: lesson.id,
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

export default function CurriculumForm({ courseId, sections, refetch }: CurriculumFormProps) {
  const defaultSections = useMemo(() => mapSectionsToForm(sections), [sections]);

  const methods = useForm<CourseForm>({
    defaultValues: { sections: defaultSections },
  });

  useEffect(() => {
    methods.reset({ sections: defaultSections });
  }, [defaultSections, methods]);

  const sectionsValue = methods.watch("sections");
  const isLessonEditorDisabled = useMemo(
    () =>
      !Array.isArray(sectionsValue) ||
      !sectionsValue.some(section => Array.isArray(section?.lessons) && section.lessons.length > 0),
    [sectionsValue]
  );

  const { mutateAsync: updateCurriculum, isPending } = useMutation({
    mutationFn: (payload: { sections: ReturnType<typeof toApiPayload> }) =>
      courseService.update({ id: courseId, data: payload }),
    onSuccess: async () => {
      addToast({ title: "Success", description: "Curriculum updated.", color: "success" });
      await refetch();
    },
    onError: error => {
      const err = error as Error;
      addToast({ title: "Error", description: err.message, color: "danger" });
    },
  });

  useEffect(() => {
    if (isPending) NProgress.start();
    else NProgress.done();
  }, [isPending]);

  const onSubmit = methods.handleSubmit(async values => {
    if (!values.sections || values.sections.length === 0) {
      addToast({
        title: "Curriculum incomplete",
        description: "Add at least one section before saving.",
        color: "warning",
      });
      return;
    }

    const sanitized = sanitizeFormSections(values.sections);
    const payload = toApiPayload(sanitized);
    await updateCurriculum({ sections: payload });
    methods.reset({ sections: sanitized });
  });

  const handleReset = () => methods.reset({ sections: defaultSections });
  const {
    formState: { isDirty },
  } = methods;

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const onSelect = (_section: CourseSection, lesson: Lesson, path: string[]) => {
    setActiveLesson(lesson);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-6 @container">
          <div className="flex flex-col gap-4 @4xl:flex-row @4xl:items-center @4xl:justify-between">
            <header className="flex flex-col gap-y-2">
              <h3 className="text-lg font-semibold text-slate-800">Curriculum Builder</h3>
              <p className="text-sm text-slate-500">Organize sections and lessons for your course.</p>
            </header>
            <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-center @4xl:justify-end @4xl:gap-4">
              <Link
                href={`/instructor/dashboard/edit-course/${courseId}/curriculum`}
                aria-disabled={isLessonEditorDisabled}
                tabIndex={isLessonEditorDisabled ? -1 : undefined}
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-slate-700 transition",
                  isLessonEditorDisabled ? "pointer-events-none opacity-60 cursor-not-allowed" : "hover:bg-slate-50"
                )}>
                <LuExternalLink className="w-4 h-4" />
                Open Lesson Editor
              </Link>
              <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-center @4xl:gap-3">
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
                  Save Curriculum
                </button>
              </div>
            </div>
          </div>
          {/* <CurriculumBuilder /> */}
          {sections && (
            <FolderTree courseSections={sections} onSelect={onSelect} activeLessonId={activeLesson?.id || null} />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
