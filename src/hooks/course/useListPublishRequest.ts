import { useQueryError } from "@/hooks/use-query-error";
import { getErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import { voidFn } from "@/libs/utils/function";
import courseQueries from "@/queries/course-queries";
import coursePublishService from "@/services/course-publish.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNProgress } from "../use-nProgress";

const queryPublishCourse = () =>
  coursePublishService
    .list({ status: "APPROVED", page: 1, limit: 10, search: "react", startDate: new Date("2025-01-01") })
    .then(res => res.data)
    .catch(error => {
      console.log("query publish course: ", error);
      if (isAxiosError(error) && error.status == 404) return [];
      else throw new Error(error.message);
    });

export default function usePublishCourses({
  queryParams,
  onApproveSuccess = voidFn,
  onRejectSuccess = voidFn,
}: Partial<{
  queryParams?: PublishCourseListParams;
  onApproveSuccess?: VoidFn;
  onRejectSuccess?: VoidFn;
}> = {}) {
  const qc = useQueryClient();
  const invalidateCoursePublish = () =>
    qc.invalidateQueries({ queryKey: courseQueries.keys.listPublishRequest(), refetchType: "active" });
  const {
    isLoading,
    data: queryCourses,
    isError,
    error,
  } = useQuery(courseQueries.options.listPublishRequests(queryParams));

  const { mutate: rejectCourse, isPending: isPendingRejectCourse } = useMutation({
    mutationFn: coursePublishService.reject,
    onSuccess() {
      addToast({ title: "Request for course publish has been rejected", color: "success" });
      invalidateCoursePublish();
      onRejectSuccess();
    },
    onError: error => {
      addToast({
        title: "Failed to reject request publish course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  const { mutate: approveCourse, isPending: isPendingApproveCourse } = useMutation({
    mutationFn: coursePublishService.approve,
    onSuccess() {
      addToast({ title: "Request for course publish has been approved", color: "success" });
      invalidateCoursePublish();
      onApproveSuccess();
    },
    onError: error => {
      addToast({
        title: "Failed to approve request publish course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  useQueryError({ isError, error });
  const hasPending = hasTrue({
    isPendingRejectCourse,
    isLoading,
    isPendingApproveCourse,
  });
  useNProgress(hasPending);
  return {
    hasPending,
    isQueryLoading: isLoading,
    queryCourses,
    rejectCourse,
    approveCourse,
  };
}
