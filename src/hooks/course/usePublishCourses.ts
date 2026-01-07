import { useQueryError } from "@/hooks/use-query-error";
import courseQueries from "@/queries/course-queries";
import coursePublishService from "@/services/course-publish.service";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const queryPublishCourse = () =>
  coursePublishService
    .list({ status: "APPROVED", page: 1, limit: 10, search: "react", startDate: new Date("2025-01-01") })
    .then(res => res.data)
    .catch(error => {
      console.log("query publish course: ", error);
      if (isAxiosError(error) && error.status == 404) return [];
      else throw new Error(error.message);
    });

export default function usePublishCourses(queryParams?: PublishCourseListParams) {
  const {
    isLoading,
    data: queryCourses,
    isError,
    error,
    refetch,
  } = useQuery(courseQueries.options.listPublishRequests(queryParams));

  useQueryError({ isError, error });

  return {
    isLoading: { isLoading },
    queryCourses,
    refetch,
  };
}
