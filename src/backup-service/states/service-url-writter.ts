import { atomPersistent } from "../utils/atom-persistent";

export const serviceURLWritter = atomPersistent<string | null>("backupServiceUrl", null);
