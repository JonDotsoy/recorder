import { recordingState } from "../recordingState";
import { storingRecordState } from "../storing-record.state";
import { recording } from "../db";

export type RecordingControl = ReturnType<typeof createRecordingControl>;

export const createRecordingControl = () => {
  const stopped = Promise.withResolvers<"stopped" | "aborted">();

  return {
    stopped: stopped.promise,
    stop: () => {
      stopped.resolve("stopped");
    },
    abort: () => {
      stopped.resolve("aborted");
    },
  };
};

/** @deprecated */
export async function startScreenRecording() {
  // Solicitar acceso para capturar la pantalla
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  // Crear un MediaRecorder para grabar el stream
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];

  // Escuchar eventos de datos disponibles
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  // Escuchar cuando la grabación se detiene
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar la grabación
    const a = document.createElement("a");
    a.href = url;
    a.download = "screen-recording.webm";
    a.click();

    // Liberar el stream
    stream.getTracks().forEach((track) => track.stop());
  };

  // Iniciar la grabación
  mediaRecorder.start();
  console.log("Recording started");

  // Detener la grabación después de 10 segundos (puedes cambiar esto)
  setTimeout(() => {
    mediaRecorder.stop();
    console.log("Recording stopped");
  }, 10000);
}

const mediaStreamFactory = {
  display: async (captureVideo?: boolean, captureAudio?: boolean) => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: captureVideo,
      audio: captureAudio,
    });
    return mediaStream;
  },
  user: async (captureVideo?: boolean, captureAudio?: boolean) => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: captureVideo,
      audio: captureAudio,
    });
    return mediaStream;
  },
};

const createMediaRecorder = async (
  kind: "display" | "user",
  captureVideo?: boolean,
  captureAudio?: boolean,
) => {
  const mediaRecorderClosed = Promise.withResolvers<MediaRecorder>();
  const mediaStream = await mediaStreamFactory[kind](
    captureVideo,
    captureAudio,
  );
  const mediaRecorder = new MediaRecorder(mediaStream);
  const chunks: Blob[] = [];
  mediaRecorder.addEventListener("dataavailable", (blobEvent) => {
    if (blobEvent.data.size > 0) {
      chunks.push(blobEvent.data);
    }
  });
  mediaRecorder.addEventListener("stop", () => {
    mediaRecorderClosed.resolve(mediaRecorder);
  });
  mediaRecorder.addEventListener("error", (errorEvent) => {
    mediaRecorderClosed.reject(errorEvent.error);
  });

  const stop = () => {
    mediaRecorder.stop();
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  const blob = () => {
    return new Blob(chunks, { type: "video/webm" });
  };

  return {
    closed: mediaRecorderClosed.promise,
    mediaStream,
    mediaRecorder,
    stop,
    blob,
  };
};

export async function startScreenRecordingWithAudio(
  recordingControl: RecordingControl,
) {
  const key = crypto.randomUUID();
  const startDate = new Date();

  const displayMediaRecorder = await createMediaRecorder("display", true, true);
  const userMediaRecorder = await createMediaRecorder("user", false, true);

  recordingState.set(true);
  storingRecordState.set(false);

  // Iniciar la grabación
  displayMediaRecorder.mediaRecorder.start();
  userMediaRecorder.mediaRecorder.start();

  const status = await recordingControl.stopped;
  displayMediaRecorder.stop();
  userMediaRecorder.stop();
  console.debug("Recording stopped", status);

  storingRecordState.set(true);

  if (status === "aborted") {
    console.log("Recording aborted");
    return;
  }

  await Promise.all([displayMediaRecorder.closed, userMediaRecorder.closed]);
  console.debug("Recording closed");

  await recording.create({
    key: `${key}-displaymedia.webm`,
    timestamp: startDate.getTime(),
    data: displayMediaRecorder.blob(),
  });

  await recording.create({
    key: `${key}-usermedia.webm`,
    timestamp: startDate.getTime(),
    data: userMediaRecorder.blob(),
  });

  storingRecordState.set(false);
  console.log("Recording with audio stopped");

  recordingState.set(false);
}
