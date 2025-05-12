import { DB_VERSION } from "./constants/DB_VERSION";

export const initializeDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const idbOpenDBRequest = indexedDB.open("recorderDB", DB_VERSION);

    idbOpenDBRequest.addEventListener("upgradeneeded", () => {
      const db = idbOpenDBRequest.result;

      if (!db.objectStoreNames.contains("recordings")) {
        const recordingsObject = db.createObjectStore("recordings", {
          keyPath: "key",
        });
        recordingsObject.createIndex("key", "key", { unique: true });
      }

      if (!db.objectStoreNames.contains("check-sync")) {
        const checkSyncObject = db.createObjectStore("check-sync", {
          keyPath: "key",
        });
        checkSyncObject.createIndex("key", "key", { unique: true });
      }
    });

    idbOpenDBRequest.addEventListener("success", (event) => {
      resolve(idbOpenDBRequest.result);
    });

    idbOpenDBRequest.addEventListener("error", (event) => {
      reject(idbOpenDBRequest.error);
    });
  });
};
