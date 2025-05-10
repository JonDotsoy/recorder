import type { RecordDTO } from "./dtos/record-dto.js";

export const initializeDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const idbOpenDBRequest = indexedDB.open("recorderDB", 1);

    idbOpenDBRequest.addEventListener("upgradeneeded", () => {
      const recordingsObject = idbOpenDBRequest.result.createObjectStore(
        "recordings",
        { keyPath: "key" },
      );
      recordingsObject.createIndex("key", "key", { unique: true });
    });

    idbOpenDBRequest.addEventListener("success", (event) => {
      resolve(idbOpenDBRequest.result);
    });

    idbOpenDBRequest.addEventListener("error", (event) => {
      reject(idbOpenDBRequest.error);
    });
  });
};

export const startTransaction = (
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  options?: IDBTransactionOptions,
) => {
  type T = void;
  const transactionDone = Promise.withResolvers<T>();
  const transaction = db.transaction(storeName, mode, options);
  transaction.addEventListener("complete", () => transactionDone.resolve());
  transaction.addEventListener("error", (event) =>
    transactionDone.reject(transaction.error),
  );
  transaction.addEventListener("abort", (event) =>
    transactionDone.reject(transaction.error),
  );
  return {
    transaction,
    promise: transactionDone.promise,
    then: <TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ) => transactionDone.promise.then(onfulfilled, onrejected),
  };
};

export const insertRecordsIntoStore = <A>(
  transaction: IDBTransaction,
  storeName: string,
  ...values: A[]
) => {
  const objectStore = transaction.objectStore(storeName);
  const pendings: Promise<void>[] = [];
  for (const value of values) {
    const addRecordDone = Promise.withResolvers<void>();
    const req = objectStore.add(value);
    req.addEventListener("success", () => addRecordDone.resolve());
    req.addEventListener("error", (event) => addRecordDone.reject(req.error));
    pendings.push(addRecordDone.promise);
  }
  return Promise.all(pendings);
};

export const db = await initializeDatabase();

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
