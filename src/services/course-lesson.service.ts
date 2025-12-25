import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

type Ids = { courseId: number; sectionId: number };
export type MutateLesson = {
  title: string;
  summary?: string;
  durationSec?: number;
  isPreview?: boolean;
};

export type MutateReorderLessons = {
  id: number;
  position: number;
}[];

export type MutateUpdateLesson = AtLeastOne<{
  title: string;
  summary: string;
  durationSec: string;
  isPreview: boolean;
}>;

const getURL = ({ courseId, sectionId }: Ids) => `${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}/lessons/`;
const courseLessonService = {
  list: (ids: Ids) => api.get(getURL(ids)),
  create: ({ lessons, ...ids }: Ids & { lessons: MutateLesson[] }) => api.post(getURL(ids), lessons),
  delete: ({ lessonId, ...ids }: Ids & { lessonId: number }) => api.delete(getURL(ids) + lessonId),
  reorder: ({ list, ...ids }: { list: MutateReorderLessons } & Ids) =>
    api.patch(getURL(ids) + "reorder", { reorders: list }),
  deleteMany: ({ lessonIds, ...ids }: { lessonIds: number[] } & Ids) =>
    api.delete(getURL(ids) + "delete-many", { data: { ids: lessonIds } }),
  update: ({ lesson, lessonId, ...ids }: { lesson: MutateUpdateLesson; lessonId: number } & Ids) =>
    api.patch(getURL(ids) + lessonId, lesson),
};

export default courseLessonService;
