import { notificationsWritter } from "../states/notifications-writter.js";

export const addNotification = (
  message: string,
  type: "log" | "error",
  timestamp: number = Date.now(),
) => {
  notificationsWritter.set([
    ...notificationsWritter.get(),
    { message, type, timestamp },
  ]);
};
