import { getErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import { addToast } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useNProgress } from "../use-nProgress";

export default function useListCourses(params?: ListCourseParams) {
  const qc = useQueryClient();
  const { data: res, isLoading: queryLoading, isError, error } = useQuery(courseQueries.options.listCourses(params));

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
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
