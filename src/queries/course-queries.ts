import courseService from "@/services/course.service";
import { queryOptions } from "@tanstack/react-query";

const courseQueries = {
  keys: {
    getCourse: (id: number) => ["coursePreview", id],
  },
  options: {
    getCourse: (id: number) =>
      queryOptions<Course>({
        queryKey: courseQueries.keys.getCourse(id),
        queryFn: () => courseService.get(id).then(res => res.data),
      }),
  },
};
export default courseQueries;
