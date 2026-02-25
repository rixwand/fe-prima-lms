import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

export default {
  list: (search?: string) =>
    api.get(endpoint.ENROLLMENT, { params: { search }, paramsSerializer: p => buildQueryParams(p) }),
};
