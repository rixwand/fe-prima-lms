import courseLessonService, { Ids } from "@/services/course-lesson.service";
import coursePublishService from "@/services/course-publish.service";
import courseSectionService from "@/services/course-section.service";
import courseService from "@/services/course.service";
import enrollmentService from "@/services/enrollment.service";
import learnService from "@/services/learn.service";
import { AppAxiosError } from "@/types/axios";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function retry(failureCount: number, error: unknown) {
  const err = error as AppAxiosError;

  if (err?.response?.status === 401) return false;

  return failureCount < 2;
}

const courseQueries = {
  keys: {
    getCourse: (id: number) => ["course-preview", id],
    getLearningCurriculum: (slug: string) => ["learning-curriculum", slug],
    listEnrolled: (search?: string) => (search ? ["enrolled-courses", search] : ["enrolled-course"]),
    listCourses: (params?: ListCourseParams) => (params ? ["course-list", params] : ["course-list"]),
    listSections: (id: number) => ["course-sections", id],
    listLessons: (ids: Ids) => ["section-lessons", ids],
    getLessonContent: (ids?: Ids & { lessonId: number }) => ["lesson-content", ids],
    listPublishRequest: (params?: PublishCourseListParams) =>
      params ? ["list-publish-request", params] : ["list-publish-request"],
    listPublicCourses: (params?: ListPublicCoursesParams) => (params ? ["public-courses", params] : ["public-courses"]),
    listPublicCourseTags: (params?: ListCourseTagsParams) =>
      params ? ["public-course-tags", params] : ["public-course-tags"],
    listCourseCategries: (params?: ListCoursesCategoriesParams) =>
      params ? ["courses-categories", params] : ["courses-categories"],
    getCourseBySlug: (slug: string) => ["coruse-preview", slug],
  },
  options: {
    getCourse: (id: number) =>
      queryOptions<Course>({
        queryKey: courseQueries.keys.getCourse(id),
        queryFn: () => courseService.get(id).then(res => res.data),
        retry,
      }),
    listCourses: (params?: ListCourseParams) =>
      queryOptions<{ courses: CourseListItem[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listCourses(params),
        queryFn: () =>
          courseService
            .list(params)
            .then(res => res.data)
            .catch(error => {
              console.log("query list course error: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw new Error(error.message);
            }),
        placeholderData: keepPreviousData,
        retry,
      }),
    listSections: (id: number) =>
      queryOptions<CourseSection[]>({
        queryKey: ["courseSections", id],
        queryFn: () =>
          courseSectionService
            .list(id)
            .then(res => res.data)
            .catch(error => {
              console.log("query course sections error: ", error);
              if (isAxiosError(error) && error.status == 404) return [];
              else throw new Error(error.message);
            }),
        enabled: Boolean(id),
        placeholderData: keepPreviousData,
        retry,
      }),
    listPublishRequests: (queryParams?: PublishCourseListParams) =>
      queryOptions<{ courses: QueryPublishCourse[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listPublishRequest(queryParams),
        queryFn: () =>
          coursePublishService
            .list(queryParams)
            .then(res => res.data)
            .catch(error => {
              console.log("query list publish course error: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw new Error(error.message);
            }),
        placeholderData: keepPreviousData,
        retry,
      }),
    listPublicCourses: (params?: ListPublicCoursesParams) =>
      queryOptions<{ courses: PublicCourseListItem[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listPublicCourses(params),
        queryFn: () =>
          courseService.PUBLIC.list(params)
            .then(res => res.data)
            .catch(error => {
              console.log("query public course error: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw new Error(error.message);
            }),
        placeholderData: keepPreviousData,
        retry,
      }),
    listPublicCourseTags: (params?: ListCourseTagsParams) =>
      queryOptions<{ tags: PublicTagListItem[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listPublicCourseTags(params),
        queryFn: () =>
          courseService.PUBLIC.listTags(params)
            .then(res => res.data)
            .catch(error => {
              console.log("query list public course tags error: ", error);
              if (isAxiosError(error) && error.status == 404) return { tags: [], meta: null };
              else throw new Error(error.message);
            }),
        retry,
      }),
    listCourseCategries: (params?: ListCoursesCategoriesParams) =>
      queryOptions<{ categories: PublicCategory[]; meta: MetaData | null }>({
        queryKey: courseQueries.keys.listCourseCategries(params),
        queryFn: () =>
          courseService.PUBLIC.listCategories(params)
            .then(res => res.data)
            .catch(error => {
              console.log("query list course categories error: ", error);
              if (isAxiosError(error) && error.status == 404) return { categories: [], meta: null };
              else throw new Error(error.message);
            }),
        retry,
      }),
    listLessons: (ids: Ids) =>
      queryOptions<QueryLessonItem[]>({
        queryKey: courseQueries.keys.listLessons(ids),
        queryFn: () =>
          courseLessonService
            .list(ids)
            .then(res => res.data)
            .catch(err => {
              if (isAxiosError(err) && err.status == 404) return [];
              throw new Error(err.message);
            }),
        enabled: false,
        placeholderData: keepPreviousData,
      }),
    getLessonContent: (ids?: Ids & { lessonId: number }, enabled?: boolean) =>
      queryOptions<LessonContent>({
        queryKey: courseQueries.keys.getLessonContent(ids),
        queryFn: () => courseLessonService.getContent(ids!).then(res => res.data),
        enabled: enabled != undefined ? enabled : !!ids,
        placeholderData: keepPreviousData,
      }),
    getCourseBySlug: (slug: string) =>
      queryOptions<CoursePreview>({
        queryKey: courseQueries.keys.getCourseBySlug(slug),
        queryFn: () => courseService.PUBLIC.get(slug).then(res => res.data),
        placeholderData: keepPreviousData,
      }),
    listEnrolled: (search?: string) =>
      queryOptions<(BaseCourse & { metaApproved: MetaCourse })[]>({
        queryKey: courseQueries.keys.listEnrolled(search),
        queryFn: () =>
          enrollmentService
            .list(search)
            .then(res => res.data)
            .catch(err => {
              if (isAxiosError(err) && err.status == 404) return [];
              throw new Error(err.message);
            }),
        placeholderData: keepPreviousData,
      }),
    getLearningCurriculum: (slug: string) =>
      queryOptions<CourseCurriculum>({
        queryKey: courseQueries.keys.getLearningCurriculum(slug),
        queryFn: () => learnService.getCurriculum(slug).then(res => res.data),
        placeholderData: keepPreviousData,
      }),
  },
};
export default courseQueries;
