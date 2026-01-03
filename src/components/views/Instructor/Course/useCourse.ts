import { getErrorMessage } from "@/libs/axios/error";
import courseService from "@/services/course.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

export default function useCourse() {
  const {
    data: res,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryFn: courseService.list,
    queryKey: ["course"],
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteCourse, isPending: deleteCoursePending } = useMutation({
    mutationFn: courseService.delete,
    onSuccess() {
      addToast({ title: "Success deleted course", color: "success" });
      refetch();
    },
    onError: error => {
      addToast({
        title: "Failed to delete course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  const { mutate: publishCourse, isPending: publishCoursePending } = useMutation({
    mutationFn: courseService.publish,
    onSuccess() {
      addToast({ title: "Request for publish course success", color: "success" });
      refetch();
    },
    onError: error => {
      addToast({
        title: "Failed to request for publish course",
        description: getErrorMessage(error as AppAxiosError),
        color: "danger",
      });
    },
  });

  return {
    courses: res?.data.courses as ICourseListItem[],
    isLoading: {
      queryLoading: isLoading,
      publishCoursePending,
      deleteCoursePending,
    },
    publishCourse,
    deleteCourse,
  };
}
