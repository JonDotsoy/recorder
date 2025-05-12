import { openPingSubscription } from "../controllers/open-ping-subscription.js";

export const pingSubscription = Array.fromAsync(openPingSubscription());
