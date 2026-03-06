import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

export default {
  create: (data: { courseId: number; code?: string }) =>
    api.post<{ invoiceUrl: string; invoiceId: string }>(`${endpoint.ORDER}/create`, data),
  list: (params?: ListOrderParams) => api.get(endpoint.ORDER, { params, paramsSerializer: p => buildQueryParams(p) }),
};
