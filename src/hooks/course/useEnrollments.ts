import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default (search?: string) => {
  const { data: courses, isLoading, error, isError } = useQuery(courseQueries.options.listEnrolled(search));

  useNProgress(true);
  useQueryError({ isError, error });

  return { courses, isLoading };
};
