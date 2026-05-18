import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { Content } from "@tiptap/core";

export type Ids = { courseId: number; sectionId: number };
export type MutateLesson = {
  title: string;
  summary?: string;
  durationSec?: number;
  type: SectionItemType;
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
  contentJson: Content;
}>;

const getURL = ({ courseId, sectionId }: Ids) => `${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}/items/`;
const courseLessonService = {
  list: (ids: Ids) => api.get(getURL(ids)),
  getContent: ({ itemId, ...ids }: Ids & { itemId: number }) => api.get(getURL(ids) + itemId + "/lesson"),
  create: ({ lessons, ...ids }: Ids & { lessons: MutateLesson[] }) => api.post(getURL(ids), lessons),
  delete: ({ itemId, ...ids }: Ids & { itemId: number }) => api.delete(getURL(ids) + itemId),
  reorder: ({ list, ...ids }: { list: MutateReorderLessons } & Ids) =>
    api.patch(getURL(ids) + "reorder", { reorders: list }),
  deleteMany: ({ lessonIds, ...ids }: { lessonIds: number[] } & Ids) =>
    api.delete(getURL(ids) + "delete-many", { data: { ids: lessonIds } }),
  update: ({ lesson, itemId, ...ids }: { lesson: MutateUpdateLesson; itemId: number } & Ids) =>
    api.patch(getURL(ids) + itemId + "/lesson", lesson),
  publishDraft: ({ newDraft, itemId, ...ids }: Ids & { newDraft?: JSONContent; itemId: number }) => {
    console.log(getURL(ids) + itemId + "/lesson/publish", newDraft ? { newDraft } : { newDraft: null });
    return api.patch(getURL(ids) + itemId + "/lesson/publish", newDraft ? { newDraft } : { newDraft: null });
  },
};

export default courseLessonService;
