import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default (search?: string) => {
  const { data, isLoading, error, isError } = useQuery(courseQueries.options.listEnrolled(search));

  useNProgress(isLoading);
  useQueryError({ isError, error });

  return { courses: { meta: data?.meta, data: data?.courses }, isLoading };
};
