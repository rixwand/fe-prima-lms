import coursePublishService from "@/services/course-publish.service";
import courseSectionService from "@/services/course-section.service";
import courseService from "@/services/course.service";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const courseQueries = {
  keys: {
    getCourse: (id: number) => ["course-preview", id],
    listCourses: () => ["course"],
    listSections: (id: number) => ["course-sections", id],
    listPublishRequest: ["list-publish-request"],
  },
  options: {
    getCourse: (id: number) =>
      queryOptions<Course>({
        queryKey: courseQueries.keys.getCourse(id),
        queryFn: () => courseService.get(id).then(res => res.data),
      }),
    listCourses: () =>
      queryOptions({
        queryKey: courseQueries.keys.listCourses(),
        queryFn: courseService.list,
        placeholderData: keepPreviousData,
      }),
    listSections: (id: number) =>
      queryOptions<CourseSection[]>({
        queryKey: ["courseSections", id],
        queryFn: () => courseSectionService.list(id).then(res => res.data),
        enabled: Boolean(id),
        placeholderData: keepPreviousData,
      }),
    listPublishRequests: (queryParams?: PublishCourseListParams) =>
      queryOptions<{ courses: QueryPublishCourse[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listPublishRequest,
        queryFn: () =>
          coursePublishService
            .list(queryParams)
            .then(res => res.data)
            .catch(error => {
              console.log("query publish course: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw new Error(error.message);
            }),
        placeholderData: keepPreviousData,
      }),
  },
};
export default courseQueries;
