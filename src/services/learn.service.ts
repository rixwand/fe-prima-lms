import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export default {
  getCurriculum: (slug: string) => api.get(`${endpoint.LEARN}/${slug}`),
};
