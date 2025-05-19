import { serviceURLState } from "../states/service-url.state";

export const downloadTranscription = async (recordId: string) => {
  const serviceURL = serviceURLState.get();
  if (!serviceURL) {
    throw new Error("Service URL is not available");
  }
  const transcriptionURL = new URL("/transcription", serviceURL);
  transcriptionURL.searchParams.append("name", btoa(recordId));
  return transcriptionURL;
};
