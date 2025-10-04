import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const courseService = {
  PUBLIC: {},
  get: () => api.get(endpoint.MY_COURSE),
};
export default courseService;
