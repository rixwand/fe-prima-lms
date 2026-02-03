import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function usePublicCourse(params?: ListPublicCoursesParams) {
  const { data, isLoading: isQueryLoading, isError, error } = useQuery(courseQueries.options.listPublicCourses(params));
  const loadings = {
    isQueryLoading,
  };
  useNProgress(hasTrue(loadings));
  useQueryError({ isError, error });
  return {
    loadings,
    courses: data?.courses,
    coursesMeta: data?.meta,
  };
}
