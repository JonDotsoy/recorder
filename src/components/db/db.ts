import type { CheckSyncDTO } from "../dtos/check-sync-dto.js";
import { initializeDatabase } from "./initialize-database.js";

export const db = await initializeDatabase();
