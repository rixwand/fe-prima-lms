import courseService from "@/services/course.service";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useCourse() {
  const {
    data: res,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryFn: courseService.list,
    queryKey: ["course"],
  });

  const { mutate: deleteCourse, isPending: pendingDelete } = useMutation({
    mutationFn: courseService.delete,
    onSuccess() {
      addToast({ title: "Success deleted course", color: "success" });
      refetch();
    },
    onError() {
      addToast({ title: "Failed to delete course", description: error?.message, color: "danger" });
    },
  });

  useEffect(() => {
    // if(isError && isAxiosError(error))
    if (isError) addToast({ color: "danger", title: "Error", description: "Something went wrong" });
  }, [isError]);

  return {
    courses: res?.data.courses as ICourseListItem[],
    isLoading,
    pendingDelete,
    deleteCourse,
  };
}
