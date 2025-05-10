import { readonlyType } from "nanostores";
import { notificationsWritter } from "./notifications-writter";


export const notifications = readonlyType(notificationsWritter);
