import { CourseForm } from "@/components/views/Instructor/Course/CreateCourse/CreateCourse";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const courseService = {
  PUBLIC: {
    get: (slug: string) => api.get(`${endpoint.COURSE}/${slug}`),
  },
  list: () => api.get(endpoint.MY_COURSE),
  create: (data: Omit<CourseForm, "coverImage"> & { coverImage: string }) => api.post(endpoint.MY_COURSE, data),
  delete: (id: number) => api.delete(`${endpoint.MY_COURSE}/${id}`),
};
export default courseService;
