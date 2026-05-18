import { getUnknownErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNProgress } from "../use-nProgress";

export default function useListCourses(params?: ListCourseParams) {
  const { data: res, isLoading: queryLoading, isError, error } = useQuery(courseQueries.options.listCourses(params));

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: getUnknownErrorMessage(error),
      });
  }, [isError, error]);

  const isLoading = {
    queryLoading,
  };
  useNProgress(hasTrue(isLoading));
  return {
    isLoading,
    courses: res?.courses,
    coursesMeta: res?.meta,
  };
}
