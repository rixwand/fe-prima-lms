import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const courseService = {
  PUBLIC: {
    get: (slug: string) => api.get(`${endpoint.COURSE}/${slug}`),
  },
  get: (id: number) => api.get(`${endpoint.MY_COURSE}/${id}`),
  list: () => api.get(endpoint.MY_COURSE),
  create: (data: Omit<CourseForm, "coverImage"> & { coverImage: string }) => api.post(endpoint.MY_COURSE, data),
  delete: (id: number) => api.delete(`${endpoint.MY_COURSE}/${id}`),
  update: ({ data, id }: { id: number; data: Partial<Omit<EditCourseForm, "fileImage">> }) =>
    api.patch(`${endpoint.MY_COURSE}/${id}`, data),
  updateTags: ({ id, tags }: { id: number; tags?: { createOrConnect: string[]; disconnectSlugs: string[] } }) =>
    api.patch(`${endpoint.MY_COURSE}/${id}/tags`, tags),
  deleteDiscount: ({ courseId, id }: { id: number; courseId: number }) =>
    api.delete(`${endpoint.MY_COURSE}/${courseId}/discounts/${id}`),
};
export default courseService;
