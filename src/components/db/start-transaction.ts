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
