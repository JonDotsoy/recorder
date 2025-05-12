import { computed } from "nanostores";
import { successPing } from "./success-ping";
import { serviceURLWritter } from "./service-url-writter";

export const serviceAvailabilityState = computed(
  [serviceURLWritter, successPing],
  (url, successPing) => {
    if (url === null || url === "") return false;
    return true;
  },
);
