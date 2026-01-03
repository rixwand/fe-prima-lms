import { useQueryError } from "@/hooks/use-query-error";
import coursePublishService from "@/services/course-publish.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Metadata } from "next";

const queryPublishCourse = () =>
  coursePublishService
    .list({ status: "APPROVED", page: 1, limit: 10, search: "react", startDate: new Date("2025-01-01") })
    .then(res => res.data)
    .catch(error => {
      console.log("query publish course: ", error);
      if (isAxiosError(error) && error.status == 404) return [];
      else throw new Error(error.message);
    });

export default function useCourses(queryParams?: PublishCourseListParams) {
  const {
    isLoading,
    data: queryCourses,
    isError,
    error,
    refetch,
  } = useQuery<{ courses: QueryPublishCourse[]; meta: Metadata | null }>({
    queryKey: ["publish-course"],
    queryFn: () =>
      coursePublishService
        .list(queryParams)
        .then(res => res.data)
        .catch(error => {
          console.log("query publish course: ", error);
          if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
          else throw new Error(error.message);
        }),
    // queryFn: queryPublishCourse,
    placeholderData: keepPreviousData,
  });

  useQueryError({ isError, error });

  return {
    isLoading: { isLoading },
    queryCourses,
    refetch,
  };
}
