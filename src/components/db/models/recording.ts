import { db } from "../db";
import type { RecordDTO } from "../../dtos/record-dto";
import { insertRecordsIntoStore } from "../insert-records-into-store";
import { startTransaction } from "../start-transaction";

export const recording = {
  create: async (...records: RecordDTO[]) => {
    const { transaction, promise: transactionPromise } = startTransaction(
      db,
      "recordings",
      "readwrite",
      { durability: "strict" },
    );

    await insertRecordsIntoStore(transaction, "recordings", ...records);

    transaction.commit();

    return Promise.all([transactionPromise]);
  },
  list: async function* (): AsyncGenerator<RecordDTO> {
    const { transaction, promise: transactionPromise } = startTransaction(
      db,
      "recordings",
      "readonly",
      { durability: "strict" },
    );

    const objectStore = transaction.objectStore("recordings");
    const request = objectStore.openCursor();

    while (true) {
      const p = Promise.withResolvers<void>();
      const success = () => p.resolve();
      const error = () => p.reject(request.error);

      request.addEventListener("success", success);
      request.addEventListener("error", error);

      await p.promise;

      request.removeEventListener("success", success);
      request.removeEventListener("error", error);

      if (request.result === null) break;

      if (request.result?.value) yield request.result?.value;

      request.result?.continue();
    }
  },
};
