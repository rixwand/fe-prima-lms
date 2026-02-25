import { getErrorMessage } from "@/libs/axios/error";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { voidFn } from "@/libs/utils/function";
import courseQueries from "@/queries/course-queries";
import courseLessonService, { MutateLesson, MutateReorderLessons } from "@/services/course-lesson.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

type TUseEditLesson = {
  sectionId: number;
  onReorderLessonSuccess?: VoidFn;
  onCreateLessonSuccess?: VoidFn;
  onBatchRemoveLessonSuccess?: VoidFn;
};
export default function useEditLessonList({
  sectionId,
  onCreateLessonSuccess = voidFn,
  onReorderLessonSuccess = voidFn,
  onBatchRemoveLessonSuccess = voidFn,
}: TUseEditLesson) {
  const { courseId } = useEditCourseContext();
  const qc = useQueryClient();
  const ids = { courseId, sectionId };
  const invalidateQueries = () =>
    qc.invalidateQueries({ queryKey: courseQueries.keys.listLessons({ sectionId, courseId }) });
  const { isLoading, data: queryLessons, refetch, isError, error } = useQuery(courseQueries.options.listLessons(ids));

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  const { mutate: createLessons, isPending: createLessonPending } = useMutation({
    mutationFn: (lessons: MutateLesson[]) => courseLessonService.create({ courseId, sectionId, lessons }),
    onError: error => {
      addToast({
        title: "Add lesson Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onCreateLessonSuccess();
      addToast({ color: "success", title: "Success", description: "Success create new lesson" });
      invalidateQueries();
    },
  });

  const { mutate: reorderLessons, isPending: reorderLessonsPending } = useMutation({
    mutationFn: (list: MutateReorderLessons) => courseLessonService.reorder({ list, sectionId, courseId }),
    onError: error => {
      addToast({
        title: "Reorder Lessons Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onReorderLessonSuccess();
      addToast({ color: "success", title: "Success", description: "Success reorder lessons" });
      invalidateQueries();
    },
  });

  const { mutate: batchRemoveLesson, isPending: batchRemoveLessonPending } = useMutation({
    mutationFn: (lessonIds: number[]) => courseLessonService.deleteMany({ sectionId, courseId, lessonIds }),
    onError: error => {
      addToast({
        title: "Batch Remove Lessons Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onBatchRemoveLessonSuccess();
      addToast({ color: "success", title: "Success", description: "Success batch remove lessons" });
      invalidateQueries();
    },
  });

  return {
    isLoading: {
      isLoading,
      reorderLessonsPending,
      batchRemoveLessonPending,
      createLessonPending,
    },
    createLessons,
    queryLessons,
    refetch,
    reorderLessons,
    batchRemoveLesson,
  };
}
