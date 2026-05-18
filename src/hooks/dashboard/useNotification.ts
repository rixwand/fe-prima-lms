import { getUnknownErrorMessage } from "@/libs/axios/error";
import notificationQueries from "@/queries/notification-queries";
import notificationService from "@/services/notification.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function (params?: ListNotificationParams) {
  const { data, error, isError, isFetching } = useQuery(notificationQueries.options.listNotifications(params));
  useQueryError({ error, isError });
  useNProgress(isFetching);

  const { mutate: readNotifications } = useMutation({
    mutationFn: notificationService.read,
    onError: e => console.log(getUnknownErrorMessage(e)),
  });

  return { notification: { data: data?.notifications ?? [], meta: data?.meta ?? null }, readNotifications };
}
