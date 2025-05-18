import { computed } from "nanostores";
import { successPingState } from "./success-ping";

export const connectedState = computed(successPingState, (success) => {
  return success;
});
