import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export default {
  purchase: (data: { courseId: number; code?: string }) =>
    api.post<{ invoiceUrl: string; invoiceId: string }>(`${endpoint.PAYMENT}/purchase/course`, data),
};
