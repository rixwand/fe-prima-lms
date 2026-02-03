import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function usePublicCourseTgas(params?: ListCourseTagsParams) {
  const {
    data,
    error,
    isError,
    isLoading,
    isPending: isPendingQuery,
  } = useQuery(courseQueries.options.listPublicCourseTags(params));

  const loadings = {
    isLoading,
    isPendingQuery,
  };
  useQueryError({ isError, error });
  useNProgress(hasTrue(loadings));

  return {
    tags: data?.tags,
    tagsMeta: data?.meta,
    loadings,
  };
}
