import type { RecordDTO } from "../../components/dtos/record-dto";
import { addNotification } from "./add-notification";
import { serviceURLState as serviceURLState } from "../states/service-url.state.js";

export const transcribeMedia = async (record: RecordDTO) => {
  const serviceURL = serviceURLState.get();
  if (serviceURL === null) {
    addNotification("El servicio de transcripción no está disponible", "error");
    return;
  }
  const response = await fetch(new URL("./transcribe-content", serviceURL), {
    method: "POST",
    body: JSON.stringify({
      key: record.key,
    }),
  });
  if (response.status === 200 || response.status === 409) {
    addNotification("Transcripción realizada con éxito", "log");
  } else {
    addNotification("Error al realizar la transcripción", "error");
  }
};
