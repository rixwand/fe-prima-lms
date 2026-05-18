import notificationService from "@/services/notification.service";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const notificationQueries = {
  keys: {
    listNotifications: (params?: ListNotificationParams) =>
      params ? ["list-notifications", params] : ["list-notifications"],
  },
  options: {
    listNotifications: (params?: ListNotificationParams) =>
      queryOptions<NotificationsListResponse>({
        queryKey: notificationQueries.keys.listNotifications(params),
        queryFn: () =>
          notificationService
            .list(params)
            .then(r => r.data)
            .catch(error => {
              if (isAxiosError(error) && error.status === 404) return { notifications: [], meta: null };
              throw error;
            }),
        placeholderData: keepPreviousData,
      }),
  },
};

export default notificationQueries;
