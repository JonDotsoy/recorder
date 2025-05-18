import { successPing } from "../states/success-ping.js";
import { serviceURLState } from "../states/service-url.state.js";

type A = string;

export async function* openPingSubscription(
  abort?: AbortSignal,
): AsyncGenerator<A> {
  const controllerPending =
    Promise.withResolvers<ReadableStreamDefaultController<A>>();
  const readable = new ReadableStream<A>({
    start: (controller) => controllerPending.resolve(controller),
  });
  const controller = await controllerPending.promise;

  let eventSource: EventSource | null = null;

  abort?.addEventListener("abort", () => {
    eventSource?.close();
    controller.close();
    successPing.set(false);
  });

  serviceURLState.subscribe((url) => {
    successPing.set(false);
    eventSource?.close();

    if (url === null) {
      return;
    }

    const urlPing = new URL(
      "/ping/subscribe",
      new URL(url ?? "", location.href),
    );
    eventSource = new EventSource(urlPing, {});
    eventSource.addEventListener("ping", (event) => {
      controller.enqueue("ping");
      successPing.set(true);
    });
    eventSource.addEventListener("error", () => {
      successPing.set(false);
    });
  });

  const readableStream = readable.getReader();
  while (true) {
    const { done, value } = await readableStream.read();
    if (done) {
      break;
    }
    yield value;
  }
}
