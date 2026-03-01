import learnService from "@/services/learn.service";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

const learnQueries = {
  keys: {
    getLearningCurriculum: (slug: string) => ["learning-curriculum", slug],
    getLearningContent: (id: { slug: string; sectionId: number; lessonId: number }) => ["learning-content", id],
    startCourse: (slug: string) => ["start-course", slug],
  },
  options: {
    getLearningCurriculum: (slug: string) =>
      queryOptions<CourseCurriculum>({
        queryKey: learnQueries.keys.getLearningCurriculum(slug),
        queryFn: () => learnService.getCurriculum(slug).then(res => res.data),
        placeholderData: keepPreviousData,
      }),
    getLearningContent: (id: { slug: string; sectionId: number; lessonId: number }) =>
      queryOptions<Pick<LessonContent, "contentLive">>({
        queryKey: learnQueries.keys.getLearningContent(id),
        queryFn: () => learnService.getLearningContent(id).then(res => res.data),
      }),
    startCourse: (slug: string) =>
      queryOptions<{ slug: string }>({
        queryKey: learnQueries.keys.startCourse(slug),
        queryFn: () => learnService.startCourse({ slug }).then(res => res.data),
        enabled: false,
      }),
  },
};

export default learnQueries;
