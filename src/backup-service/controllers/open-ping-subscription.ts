import { successPingState } from "../states/success-ping.js";
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
    successPingState.set(false);
  });

  serviceURLState.subscribe((url) => {
    console.log("🚀 ~ serviceURLState.subscribe ~ url:", url);
    successPingState.set(false);
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
      successPingState.set(true);
    });
    eventSource.addEventListener("error", () => {
      successPingState.set(false);
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
