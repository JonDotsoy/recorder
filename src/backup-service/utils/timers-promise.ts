export namespace timersPromise {
  const timers = new Set<Symbol>();
  const pendings = new Set<Promise<void>>();

  export const setInterval = (callback: () => Promise<void>, delay: number) => {
    const timer = Symbol("timer");
    timers.add(timer);

    const intervalHandler = async () => {
      while (timers.has(timer)) {
        await callback().catch((err) => console.error(err));
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    };

    const intervalProcess = intervalHandler();
    pendings.add(intervalProcess);

    return timer;
  };

  export const clearInterval = (timer: Symbol) => {
    timers.delete(timer);
  };
}
