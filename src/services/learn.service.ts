import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

export default {
  getCurriculum: (slug: string) => api.get(`${endpoint.LEARN}/${slug}`),
  getLessonContent: ({ itemId, sectionId, slug }: { slug: string; sectionId: number; itemId: number }) =>
    api.get(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/lesson`),
  startCourse: ({ slug }: { slug: string }) => api.get(`${endpoint.LEARN}/${slug}/start-course`),
  lessonComplete: ({ slug, itemId }: { slug: string; itemId: number }) =>
    api.patch(`${endpoint.LEARN}/${slug}/lesson-complete/${itemId}`),
  getQuizContent: ({ itemId, sectionId, slug }: { slug: string; sectionId: number; itemId: number }) =>
    api.get(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/quiz`),
  startQuiz: ({ itemId, sectionId, slug }: { slug: string; sectionId: number; itemId: number }) =>
    api.post<QuizAttempt>(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/quiz/start-quiz`),
  submitQuiz: ({
    ids: { itemId, sectionId, slug, attemptId },
    answers,
  }: {
    ids: { attemptId: number; slug: string; sectionId: number; itemId: number };
    answers: QuizSubmissionForm["answers"];
  }) => api.post(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/quiz/submit-quiz/${attemptId}`, { answers }),
  getQuizAttemptHistory: (
    params: { page: number; limit: number },
    { itemId, sectionId, slug }: { slug: string; sectionId: number; itemId: number },
  ) =>
    api.get(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/quiz/attempt-history`, {
      params,
      paramsSerializer: params => buildQueryParams(params),
    }),
  getQuizAttemptHistoryDetail: ({
    itemId,
    sectionId,
    slug,
    attemptId,
  }: {
    slug: string;
    sectionId: number;
    itemId: number;
    attemptId: number;
  }) =>
    api.get(`${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/quiz/attempt-history/${attemptId}`, {
      paramsSerializer: params => buildQueryParams(params),
    }),
};
