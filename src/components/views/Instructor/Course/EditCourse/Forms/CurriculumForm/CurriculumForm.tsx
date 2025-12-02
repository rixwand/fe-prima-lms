"use client";
import AddSectionsDialog from "@/components/commons/Dialog/AddSectionsDialog";
import FolderTree from "@/components/commons/FolderTree";
import { TiptapViewer } from "@/components/commons/TiptapViewer/TiptapViewer";
import content from "@/components/tiptap-templates/simple/data/content.json";
import { useNProgress } from "@/hooks/use-nProgress";
import { useStickySentinel } from "@/hooks/use-sticky-shadow";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { FolderTreeContext } from "@/libs/context/FolderTreeContext";
import { hasTrue } from "@/libs/utils/boolean";
import cn from "@/libs/utils/cn";
import { diffList } from "@/libs/utils/data";
import { Button, Checkbox } from "@heroui/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
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
import { AddSectionsFormRhf, CourseSectionForm, CurriculumFormProps, EditCourseForm } from "../form.type";
import AddSectionsForm from "./AddSectionsForm";
import useEditCurriculum from "./useEditCurriculum";

export default function CurriculumForm({ courseId, refetch, defaultValue }: CurriculumFormProps) {
  // const defaultSections = useMemo(() => mapSectionsToForm(defaultValue), [defaultValue]);
  const { getFieldState, watch, getValues, reset } = useFormContext<EditCourseForm>();

  const sectionsValue = watch("sections");
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

  const [activeLesson, setActiveLesson] = useState<NonNullable<CourseSectionForm["lessons"]>[number] | null>(null);
  const [activeLessonPath, setPathActiveLesson] = useState<Array<string> | null>(null);
  const [editMode, setEditMode] = useState(false);
  const newSectionState = useState<string | null>(null);
  const expandSectionsState = useState<null | boolean>(null);
  const {
    showCoursePreviewState: [showPreview, setShowCoursePreview],
  } = useEditCourseContext();

  const onSelect = (
    _section: CourseSectionForm,
    lesson: NonNullable<CourseSectionForm["lessons"]>[number],
    path: string[]
  ) => {
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

  const previewParentRef = useRef<HTMLDivElement | null>(null);
  const parentFormRef = useRef<HTMLDivElement | null>(null);

  const { setSentinelRef: sentinelPreviewRef, stuck: previewStuck } = useStickySentinel(previewParentRef);
  const { setSentinelRef: sentinelFormRef, stuck: formStuck } = useStickySentinel(parentFormRef);

  const { querySections, isPending, reorderSection } = useEditCurriculum({
    courseId,
    onReorderSectionSuccess() {
      setEditMode(false);
    },
  });

  const resetSections = useCallback(() => {
    reset({ sections: querySections ? querySections.sections : defaultValue });
  }, [defaultValue, reset, querySections]);

  const addSectionsMethod = useForm<AddSectionsFormRhf>({ defaultValues: { sections: [] } });
  const openAddSectionsModal = () => {
    addSectionsMethod.setValue("sections", [{ title: "New Section" }]);
    AddSectionsDialog({
      content: close => <AddSectionsForm rhfMethods={addSectionsMethod} close={close} />,
      onSubmit: async () => {
        console.log(addSectionsMethod.getValues("sections"));
      },
      title: "Add Sections",
      formSubscribe: addSectionsMethod.subscribe,
      fieldName: "sections",
    });
  };

  const handleSubmitReorder = () => {
    const base = querySections ? querySections.sections : defaultValue;
    const changes = getValues("sections") as CourseSection[];
    const dirtyValue = diffList(base, changes, { props: ["position"] });
    if (dirtyValue.length == 0) return setEditMode(false);
    return reorderSection({ courseId, data: dirtyValue });
  };

  useNProgress(hasTrue(isPending));

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
                onPress={resetSections}
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
          {getValues("sections") && (
            <FolderTreeContext.Provider value={{ editMode, activeLessonId: activeLesson?.id }}>
              <div className={"px-6 pb-6"}>
                <FolderTree
                  onSelect={onSelect}
                  activeLessonId={activeLesson?.id || null}
                  newSectionState={newSectionState}
                />
              </div>
            </FolderTreeContext.Provider>
          )}
        </div>
      </form>
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
