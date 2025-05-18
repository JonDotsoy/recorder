import { computed, readonlyType } from "nanostores";
import { serviceURLWritter } from "./service-url-writter.js";
import { serviceAvailabilityState } from "./service-availability.js";

export const serviceURLState = computed(
  [serviceURLWritter, serviceAvailabilityState],
  (serviceURLWritter, serviceAvailabilityState) => {
    if (!serviceAvailabilityState) return null;
    if (serviceURLWritter === null || serviceURLWritter === "") return null;
    if (!URL.canParse(serviceURLWritter, globalThis.location.href)) return null;
    return new URL(serviceURLWritter, globalThis.location.href);
  },
);
