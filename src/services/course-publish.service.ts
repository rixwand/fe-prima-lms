import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

const coursePublishService = {
  list: (params?: PublishCourseListParams) =>
    api.get(endpoint.PUBLISH_COURSE + "/list", {
      params,
      paramsSerializer: params => buildQueryParams(params),
    }),
  reject: ({ reqId, notes }: { reqId: number; notes: string }) =>
    api.patch(endpoint.PUBLISH_COURSE + `/reject/${reqId}`, { notes }),
  approve: (reqId: number) => api.patch(endpoint.PUBLISH_COURSE + `/approve/${reqId}`),
};

export default coursePublishService;
