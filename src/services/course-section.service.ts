import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const courseSectionService = {
  list: (id: number) => api.get(`${endpoint.MY_COURSE}/${id}/sections`),
  create: ({ courseId, sections }: { courseId: number; sections: string[] }) =>
    api.post(`${endpoint.MY_COURSE}/${courseId}/sections`, { arrayTitle: sections }),
  delete: ({ courseId, sectionId }: { courseId: number; sectionId: number }) =>
    api.delete(`${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}`),
  reorder: ({ courseId, data }: { courseId: number; data: { id: number; position: number }[] }) =>
    api.patch(`${endpoint.MY_COURSE}/${courseId}/sections/reorder`, { reorders: data }),
  rename: ({ courseId, title, sectionId }: { courseId: number; sectionId: number; title: string }) =>
    api.patch(`${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}`, { title }),
  deleteMany: ({ courseId, sectionIds }: { courseId: number; sectionIds: number[] }) =>
    api.delete(`${endpoint.MY_COURSE}/${courseId}/sections/delete-many`, { data: { ids: sectionIds } }),
};

export default courseSectionService;
