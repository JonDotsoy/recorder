import { computed } from "nanostores";
import { successPingState } from "./success-ping";
import { serviceURLWritter } from "./service-url-writter";

export const serviceAvailabilityState = computed(
  [serviceURLWritter, successPingState],
  (url, successPing) => {
    if (url === null || url === "") return false;
    return true;
  },
);
