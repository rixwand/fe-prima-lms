import { getErrorMessage } from "@/libs/axios/error";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { voidFn } from "@/libs/utils/function";
import courseLessonService, {
  MutateLesson,
  MutateReorderLessons,
  MutateUpdateLesson,
} from "@/services/course-lesson.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

type TQueryLesson = {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  title: string;
  slug: string;
  position: number;
  sectionId: number;
  summary: string | null;
  durationSec: number | null;
  isPreview: boolean;
};
type TUseEditLesson = {
  sectionId: number;
  onCreateLessonSuccess?: VoidFn;
  onReorderLessonSuccess?: VoidFn;
  onRemoveLessonSuccess?: VoidFn;
  onBatchRemoveLessonSuccess?: VoidFn;
  onUpdateLessonSuccess?: (variables: { lesson: MutateUpdateLesson; lessonId: number }) => void;
};
export default function useEditLesson({
  sectionId,
  onCreateLessonSuccess = voidFn,
  onRemoveLessonSuccess = voidFn,
  onReorderLessonSuccess = voidFn,
  onBatchRemoveLessonSuccess = voidFn,
  onUpdateLessonSuccess = voidFn,
}: TUseEditLesson) {
  const { courseId } = useEditCourseContext();
  const ids = { courseId, sectionId };
  const {
    isLoading,
    data: queryLessons,
    refetch,
    isError,
    error,
  } = useQuery<TQueryLesson[]>({
    queryKey: ["sectionLesson", sectionId],
    queryFn: () =>
      courseLessonService
        .list(ids)
        .then(res => res.data)
        .catch(err => {
          if (isAxiosError(err) && err.status == 404) return [];
          throw new Error(err.message);
        }),
    enabled: false,
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);
  const { mutate: createLessons, isPending: createLessonPending } = useMutation({
    mutationFn: (lessons: MutateLesson[]) => courseLessonService.create({ ...ids, lessons }),
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
      refetch();
    },
  });

  const { mutate: removeLesson, isPending: removeLessonPending } = useMutation({
    mutationFn: (lessonId: number) => courseLessonService.delete({ lessonId, sectionId, courseId }),
    onError: error => {
      addToast({
        title: "Remove Lesson Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onRemoveLessonSuccess();
      addToast({ color: "success", title: "Success", description: "Success remove lesson" });
      refetch();
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
      refetch();
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
      refetch();
    },
  });

  const { mutate: updateLesson, isPending: updateLessonPending } = useMutation({
    mutationFn: (props: { lesson: MutateUpdateLesson; lessonId: number }) =>
      courseLessonService.update({ courseId, sectionId, ...props }),
    onError: error => {
      addToast({
        title: "Update Lessons Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({}, variable) {
      onUpdateLessonSuccess(variable);
      addToast({ color: "success", title: "Success", description: "Success update lessons" });
      refetch();
    },
  });

  return {
    isLoading: {
      isLoading,
      createLessonPending,
      removeLessonPending,
      reorderLessonsPending,
      batchRemoveLessonPending,
      updateLessonPending,
    },
    queryLessons,
    createLessons,
    refetch,
    removeLesson,
    reorderLessons,
    batchRemoveLesson,
    updateLesson,
  };
}
