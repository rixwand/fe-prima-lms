import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

type Ids = { courseId: number; sectionId: number; lessonId: number };
const getUrl = ({ courseId, sectionId, lessonId }: Ids) =>
  endpoint.MY_COURSE + `/${courseId}/sections/${sectionId}/lessons/${lessonId}/blocks/`;

const courseLessonBlockServices = {
  create: ({ data, ...ids }: Ids & { data: AtLeastOne<BlockData> }) => api.post(getUrl(ids), data),
  get: (ids: Ids) => api.get(getUrl(ids)),
  update: ({ blockId, payload, ...ids }: { blockId: number; payload: AtLeastOne<BlockData> } & Ids) =>
    api.patch(getUrl(ids) + blockId, payload),
};

export default courseLessonBlockServices;
