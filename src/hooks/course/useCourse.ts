import { getErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import courseService from "@/services/course.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

const useCourse = (id: number, option: { refetchOnMutateSuccess?: boolean; enabled?: boolean } = { enabled: true }) => {
  const qc = useQueryClient();
  const {
    data: course,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    ...courseQueries.options.getCourse(id),
    enabled: option.enabled,
  });
  const invalidateCourse = () => {
    qc.invalidateQueries({ queryKey: courseQueries.keys.getCourse(id), refetchType: "active" });
    qc.invalidateQueries({ queryKey: courseQueries.keys.listCourses(), refetchType: "active" });
    if (option?.refetchOnMutateSuccess == true) {
      console.log("refetch");
      refetch();
    }
  };

  useQueryError({ isError, error });
  const {
    mutate: updateCourse,
    mutateAsync: updateCourseAsync,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationFn: courseService.update,
    onError: e => {
      console.log(e);
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      invalidateCourse();
    },
  });

  const {
    mutate: updateTags,
    mutateAsync: updateTagsAsync,
    isPending: isPendingTags,
  } = useMutation({
    mutationFn: courseService.updateTags,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      invalidateCourse();
    },
  });

  const {
    mutate: updateCategories,
    mutateAsync: updateCategoriesAsync,
    isPending: isPendingCategories,
  } = useMutation({
    mutationFn: courseService.updateCategories,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      invalidateCourse();
    },
  });

  const {
    mutate: deleteCourse,
    mutateAsync: deleteCourseAsync,
    isPending: deleteCoursePending,
  } = useMutation({
    mutationFn: courseService.delete,
    onSuccess() {
      addToast({ title: "Success deleted course", color: "success" });
      invalidateCourse();
    },
    onError: error => {
      addToast({
        title: "Failed to delete course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  const {
    mutate: deleteDiscount,
    mutateAsync: deleteDiscountAsync,
    isPending: isPendingDeleteDiscount,
    isSuccess: isSuccessDeleteDiscount,
  } = useMutation({
    mutationFn: courseService.deleteDiscount,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success remove discount", color: "success" });
      invalidateCourse();
    },
  });

  const {
    mutate: publishCourse,
    mutateAsync: publishCourseAsync,
    isPending: publishCoursePending,
  } = useMutation({
    mutationFn: courseService.publish,
    onSuccess() {
      addToast({ title: "Request for publish course success", color: "success" });
      invalidateCourse();
    },
    onError: error => {
      addToast({
        title: "Failed to request for publish course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  const {
    mutate: cancelPublishReq,
    mutateAsync: cancelPublishReqAsync,
    isPending: isPendingCancelPublishReq,
  } = useMutation({
    mutationFn: courseService.cancelPublishReq,
    onSuccess() {
      addToast({ title: "Request for course publish has been canceled", color: "success" });
      invalidateCourse();
    },
    onError: error => {
      addToast({
        title: "Failed to cancel request publish course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  const {
    mutate: applyDraft,
    mutateAsync: applyDraftAsync,
    isPending: isPendingApplyDraft,
  } = useMutation({
    mutationFn: () => courseService.applyDraft(id),
    onSuccess() {
      addToast({ title: "Publish course changes success", color: "success" });
      invalidateCourse();
    },
    onError: error => {
      addToast({
        title: "Failed publish course changes",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });
  const pending = {
    isFetching,
    isPendingUpdate,
    isPendingTags,
    isPendingDeleteDiscount,
    publishCoursePending,
    isPendingCancelPublishReq,
    deleteCoursePending,
    isPendingApplyDraft,
    isPendingCategories,
  };
  const hasPending = hasTrue(pending);

  useNProgress(hasPending);
  return {
    queryPending: isFetching,
    queryError: error,
    queryIsError: isError,
    hasPending,
    updateCourse,
    updateCourseAsync,
    course,
    updateTags,
    updateTagsAsync,
    deleteDiscount,
    deleteDiscountAsync,
    isSuccessDeleteDiscount,
    publishCourse,
    cancelPublishReq,
    cancelPublishReqAsync,
    deleteCourse,
    deleteCourseAsync,
    applyDraft,
    applyDraftAsync,
    updateCategories,
    updateCategoriesAsync,
    refetch,
    pending,
    publishCourseAsync,
  };
};
export default useCourse;
