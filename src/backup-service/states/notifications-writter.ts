import { atomPersistent } from "../utils/atom-persistent";

export const notificationsWritter = atomPersistent<
  { message: string; type: "log" | "error"; timestamp: number }[]
>("notifications", []);
