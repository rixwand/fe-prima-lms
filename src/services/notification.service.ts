import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

function read(id: number): Promise<{ id: number }>;
function read(): Promise<{ message: string }>;
function read(id?: number) {
  if (typeof id === "number") {
    return api.patch(endpoint.NOTIFICATION + `/read/${id}`) as Promise<{ id: number }>;
  }

  return api.patch(endpoint.NOTIFICATION + `/read/all`) as Promise<{ message: string }>;
}

export default {
  list: (params?: ListNotificationParams) =>
    api.get<NotificationsListResponse>(endpoint.NOTIFICATION, { params, paramsSerializer: p => buildQueryParams(p) }),
  read,
};
