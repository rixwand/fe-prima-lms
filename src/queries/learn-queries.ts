import learnService from "@/services/learn.service";
import { infiniteQueryOptions, keepPreviousData, queryOptions } from "@tanstack/react-query";

const learnQueries = {
  keys: {
    getLearningCurriculum: (slug: string) => ["learning-curriculum", slug],
    getLessonContent: (id: { slug: string; sectionId: number; itemId: number }) => ["lesson-content", id],
    startCourse: (slug: string) => ["start-course", slug],
    getQuizContent: (id: { slug: string; sectionId: number; itemId: number }) => ["quiz-content", id],
    startQuiz: (id: { slug: string; sectionId: number; itemId: number }) => ["start-quiz", id],
    getQuizAttemptHistory: (ids: { slug: string; sectionId: number; itemId: number }) => ["quiz-attempt-history", ids],
    getQuizAttemptHistoryDetail: (ids: { slug: string; sectionId: number; itemId: number; attemptId: number }) => [
      "attempt-history-detail",
      ids,
    ],
  },
  options: {
    getLearningCurriculum: (slug: string) =>
      queryOptions<CourseCurriculum>({
        queryKey: learnQueries.keys.getLearningCurriculum(slug),
        queryFn: () => learnService.getCurriculum(slug).then(res => res.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
      }),
    getLessonContent: (id: { slug: string; sectionId: number; itemId: number }) =>
      queryOptions<Pick<Lesson, "contentLive">>({
        queryKey: learnQueries.keys.getLessonContent(id),
        queryFn: () => learnService.getLessonContent(id).then(res => res.data),
      }),
    getQuizContent: (id: { slug: string; sectionId: number; itemId: number }) =>
      queryOptions<PublishedQuizData>({
        queryKey: learnQueries.keys.getQuizContent(id),
        queryFn: () => learnService.getQuizContent(id).then(res => res.data),
      }),
    startCourse: (slug: string) =>
      queryOptions<{ slug: string }>({
        queryKey: learnQueries.keys.startCourse(slug),
        queryFn: () => learnService.startCourse({ slug }).then(res => res.data),
        enabled: false,
      }),
    getQuizAttemptHistory: (ids: { slug: string; sectionId: number; itemId: number }) =>
      infiniteQueryOptions<QuizAttemptHistoryResponse>({
        queryKey: learnQueries.keys.getQuizAttemptHistory(ids),
        queryFn: ({ pageParam }) =>
          learnService.getQuizAttemptHistory({ page: pageParam as number, limit: 5 }, ids).then(res => res.data),
        initialPageParam: 1,
        getNextPageParam: lastPage => {
          const { page, totalPage } = lastPage.meta;
          return page < totalPage ? page + 1 : undefined;
        },
      }),
    getQuizAttemptHistoryDetail: (ids: { slug: string; sectionId: number; itemId: number; attemptId: number }) =>
      queryOptions({
        queryKey: learnQueries.keys.getQuizAttemptHistoryDetail(ids),
        queryFn: () => learnService.getQuizAttemptHistoryDetail(ids),
      }),
  },
};

export default learnQueries;
