import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export default {
  getCurriculum: (slug: string) => api.get(`${endpoint.LEARN}/${slug}`),
  getLearningContent: ({ lessonId, sectionId, slug }: { slug: string; sectionId: number; lessonId: number }) =>
    api.get(`${endpoint.LEARN}/${slug}/${sectionId}/${lessonId}`),
  startCourse: ({ slug }: { slug: string }) => api.get(`${endpoint.LEARN}/${slug}/start-course`),
  lessonComplete: ({ slug, lessonId }: { slug: string; lessonId: number }) =>
    api.patch(`${endpoint.LEARN}/${slug}/lesson-complete/${lessonId}`),
};
