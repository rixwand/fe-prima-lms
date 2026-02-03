import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function useCourseCategories(params?: ListCoursesCategoriesParams) {
  const {
    data,
    isLoading: isQueryLoading,
    isPending: isQueryPending,
    isError,
    error,
  } = useQuery(courseQueries.options.listCourseCategries(params));

  const loadings = {
    isQueryLoading,
    isQueryPending,
  };
  useNProgress(hasTrue(loadings));
  useQueryError({ isError, error });
  return {
    loadings,
    categories: data?.categories || [],
    meta: data?.meta || null,
  };
}
