interface ListNotificationParams {
  page?: number | undefined;
  limit?: number | undefined;
  isRead?: boolean | undefined;
  type?: string | undefined;
}

interface NotificationsListResponse {
  meta: (MetaData & { newNotif: number }) | null;
  notifications: NotificationsListItem[];
}

interface NotificationsListItem {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
  metadata?: object;
}
