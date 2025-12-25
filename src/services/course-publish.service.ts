import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

const coursePublishService = {
  list: (params?: PublishCourseListParams) =>
    api.get(endpoint.PUBLISH_COURSE + "/list", {
      params,
      paramsSerializer: params => buildQueryParams(params),
    }),
};

export default coursePublishService;
