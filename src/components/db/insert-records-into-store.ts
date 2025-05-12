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
