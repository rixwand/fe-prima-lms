import { getErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import { voidFn } from "@/libs/utils/function";
import courseQueries from "@/queries/course-queries";
import courseLessonService, { MutateUpdateLesson } from "@/services/course-lesson.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";
type Props = {
  idsPath: { courseId: number; sectionId: number; lessonId: number };
  onRemoveLessonSuccess?: VoidFn;
  onUpdateLessonSuccess?: (variable: MutateUpdateLesson) => void;
  enableQueryContent?: boolean;
  onPublishContentDraftSuccess?: VoidFn;
};
export const useEditLesson = ({
  idsPath,
  onRemoveLessonSuccess = voidFn,
  onUpdateLessonSuccess = voidFn,
  onPublishContentDraftSuccess = voidFn,
  enableQueryContent,
}: Props) => {
  const qc = useQueryClient();
  const invalidateQueries = () =>
    qc.invalidateQueries({
      queryKey: ["section-lessons", idsPath.sectionId],
    });

  const {
    data: lessonContent,
    error,
    isError,
    isLoading: isPendingQuery,
    refetch,
  } = useQuery(courseQueries.options.getLessonContent(idsPath, enableQueryContent));

  useQueryError({ isError, error });
  const { mutate: removeLesson, isPending: removeLessonPending } = useMutation({
    mutationFn: () => courseLessonService.delete(idsPath),
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
      invalidateQueries();
    },
  });

  const { mutate: publishDraft, isPending: isPendingPublishDraft } = useMutation({
    mutationFn: ({ newDraft }: { newDraft?: JSONContent }) =>
      courseLessonService.publishDraft({ ...idsPath, newDraft }),
    onError: error => {
      addToast({
        title: "Publish Draft Content Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({ data }) {
      addToast({
        color: "success",
        title: "Success",
        description: data.message ?? "Success publish draft content lessons",
      });
      // invalidateQueries();
      refetch();
      onPublishContentDraftSuccess();
    },
  });

  const { mutate: updateLesson, isPending: updateLessonPending } = useMutation({
    mutationFn: (lesson: MutateUpdateLesson) => courseLessonService.update({ ...idsPath, lesson }),
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
      invalidateQueries();
    },
  });
  const pending = {
    isPendingQuery,
    updateLessonPending,
    removeLessonPending,
    isPendingPublishDraft,
  };
  useNProgress(hasTrue(pending));
  return {
    lessonContent,
    pending,
    updateLesson,
    removeLesson,
    publishDraft,
  };
};
