import courseService from "@/services/course.service";
import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useCourse() {
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryFn: courseService.get,
    queryKey: ["course"],
  });

  useEffect(() => {
    if (isError) addToast({ color: "danger", title: "Error", description: "Something went wrong" });
  }, [isError]);

  return {
    courses: res?.data.courses as ICourseListItem[],
    isLoading,
  };
}
