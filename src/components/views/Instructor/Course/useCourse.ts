import { getErrorMessage } from "@/libs/axios/error";
import courseService from "@/services/course.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect } from "react";
import { isAxiosError } from "axios";

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

  const { mutate: deleteCourse, isPending: pendingDelete } = useMutation({
    mutationFn: courseService.delete,
    onSuccess() {
      addToast({ title: "Success deleted course", color: "success" });
      refetch();
    },
    onError: (error) => {
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

  return {
    courses: res?.data.courses as ICourseListItem[],
    isLoading,
    pendingDelete,
    deleteCourse,
  };
}
