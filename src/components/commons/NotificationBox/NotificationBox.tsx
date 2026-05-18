import notificationQueries from "@/queries/notification-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FiBell, FiCheckCircle, FiSettings, FiXCircle } from "react-icons/fi";
import { LuClockAlert } from "react-icons/lu";

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "course_submission":
      return <LuClockAlert className="text-yellow-500" />;
    case "course_approved":
      return <FiCheckCircle className="text-green-500" />;
    case "course_rejected":
      return <FiXCircle className="text-red-500" />;
    case "course_submission_canceled":
      return <FiXCircle className="text-red-500" />;
    case "system":
      return <FiSettings className="text-blue-500" />;
    default:
      return <FiBell className="text-gray-400" />;
  }
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleString();
};
export default function NotificationBox({
  notifications,
  readNotif,
  newNotif,
}: {
  notifications: NotificationsListItem[];
  readNotif: () => void;
  newNotif: number;
}) {
  const qc = useQueryClient();
  useEffect(() => {
    if (newNotif > 0) readNotif();

    return () => {
      if (newNotif) qc.invalidateQueries({ queryKey: notificationQueries.keys.listNotifications() });
    };
  }, []);
  return (
    <div className="w-full overflow-hidden">
      <div className="max-h-[400px] min-h-[300px] scrollbar-hide overflow-y-scroll">
        {notifications.length == 0 ? (
          <div className="w-full h-52 flex justify-center items-center">
            <p className="text-slate-500 font-medium">No notifications found</p>
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              className={`flex gap-3 p-4 border-abu border-b hover:bg-gray-50 transition ${!item.isRead ? "bg-blue-50" : ""}`}>
              {/* Icon */}
              <div className="text-xl mt-1">{getIcon(item.type)}</div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  {!item.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
                </div>

                <p className="text-sm text-gray-600">{item.message}</p>

                <p className="text-xs mt-1 text-gray-400">{formatTime(item.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
