import { CourseForm } from "@/components/views/Instructor/Course/CreateCourse/form.type";
import { EditCourseForm } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

const courseService = {
  PUBLIC: {
    get: (slug: string) => api.get(`${endpoint.COURSE}/${slug}`),
    list: (params?: ListPublicCoursesParams) =>
      api.get(`${endpoint.COURSE}/list`, {
        params,
        paramsSerializer: params => buildQueryParams(params),
      }),
    listTags: (params?: ListCourseTagsParams) =>
      api.get(endpoint.COURSE + "/list-tags", { params, paramsSerializer: p => buildQueryParams(p) }),
    listCategories: (params?: ListCoursesCategoriesParams) =>
      api.get(endpoint.COURSE + "/list-categories", {
        params,
        paramsSerializer: p => buildQueryParams(p),
      }),
  },
  get: (id: number) => api.get(`${endpoint.MY_COURSE}/${id}`),
  list: (params?: ListCourseParams) =>
    api.get(endpoint.MY_COURSE, {
      params,
      paramsSerializer: params => buildQueryParams(params),
    }),
  create: (
    data: Omit<CourseForm, "coverImage" | "categories"> & {
      coverImage: string;
      categories: { ids: number[]; primaryId: number };
    },
  ) => api.post(endpoint.MY_COURSE, data),
  delete: (id: number) => api.delete(`${endpoint.MY_COURSE}/${id}`),
  update: ({ data, id }: { id: number; data: Partial<Omit<EditCourseForm, "fileImage">> }) =>
    api.patch(`${endpoint.MY_COURSE}/${id}`, data),
  updateTags: ({ id, tags }: { id: number; tags?: { createOrConnect: string[]; disconnectSlugs: string[] } }) =>
    api.patch(`${endpoint.MY_COURSE}/${id}/tags`, tags),
  updateCategories: ({ id, categories }: { id: number; categories: { ids: number[]; primaryId: number } }) =>
    api.patch(`${endpoint.MY_COURSE}/${id}/categories`, { newCategories: categories }),
  deleteDiscount: ({ courseId, id }: { id: number; courseId: number }) =>
    api.delete(`${endpoint.MY_COURSE}/${courseId}/discounts/${id}`),
  publish: ({ notes, id }: { notes: string; id: number }) => api.post(`${endpoint.MY_COURSE}/${id}/publish`, { notes }),
  cancelPublishReq: (id: number) => api.delete(`${endpoint.MY_COURSE}/${id}/cancel-publish`),
  applyDraft: (courseId: number) => api.patch(endpoint.MY_COURSE + `/${courseId}/apply-draft`),
};
export default courseService;
