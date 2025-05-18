import { addNotification } from "./add-notification.js";
import { serviceURLState as serviceURLState } from "../states/service-url.state.js";
import type { RecordDTO } from "../../components/dtos/record-dto.js";

export const syncContent = async (record: RecordDTO) => {
  const serviceURL = serviceURLState.get();
  if (serviceURL === null) {
    addNotification("El servicio de backup no está disponible", "error");
    return;
  }
  const response = await fetch(new URL("./sync-content", serviceURL), {
    method: "PUT",
    body: record.data,
    headers: {
      "Content-Type": record.data.type,
      "Content-Name": record.key,
      "Content-Hash": record.timestamp.toString(),
    },
  });
  if (response.status === 200 || response.status === 409) {
    addNotification("Backup realizado con éxito", "log");
  } else {
    addNotification("Error al realizar el backup", "error");
  }
};
