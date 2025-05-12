import { useStore } from "@nanostores/react";
import { recordsListState } from "../recordsListState.js";
import { BytesFormat } from "@jondotsoy/utils-js/bytes-format";
import { serviceAvailabilityState } from "../../backup-service/states/service-availability.js";
import { BackupButton } from "./backup-button.js";
import { TranscribeButton } from "./transcribe-button.js";
import { RecordCard } from "./record-card.js";
import { useMemo } from "react";

export const RecordList = () => {
  const isServiceAvailability = useStore(serviceAvailabilityState);
  const records = useStore(recordsListState);

  const onDownloadRecord = (key: string) => {
    const record = records?.find((record) => record.key === key);
    if (!record) return;
    const { data } = record;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: data.type }));
    a.style.display = "none";
    document.body.appendChild(a);
    a.download = key;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onPlayRecord = (key: string) => {
    const record = records?.find((record) => record.key === key);
    if (!record) return;
    const { data } = record;
    const u = URL.createObjectURL(new Blob([data], { type: data.type }));
    window.open(u, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(u);
    }, 10_000);
  };

  const onDeleteRecord = (key: string) => {
    confirm("¿Estás seguro de que quieres eliminar este registro?");
  };

  const groupedRecords = useMemo(
    () =>
      Object.groupBy(
        (records ?? []).sort((a, b) => b.timestamp - a.timestamp),
        (record) => record.timestamp,
      ),
    [records],
  );

  return (
    <div className="container mx-auto p-4 flex flex-col gap-8">
      {Object.entries(groupedRecords).map(([timestamp, records]) => (
        <div key={timestamp} className="flex flex-col gap-3">
          <h4 className="text-gray-500">
            {new Date(parseInt(timestamp)).toLocaleString(undefined, {
              timeStyle: "full",
              dateStyle: "full",
            })}
          </h4>
          {records?.map((record) => (
            <RecordCard
              key={record.key}
              record={record}
              onDownloadRecord={onDownloadRecord}
              onPlayRecord={onPlayRecord}
              onDeleteRecord={onDeleteRecord}
            />
          ))}
        </div>
      ))}
      {records?.length === 0 && (
        <div className="p-4">
          <p className="text-gray-500">No hay grabaciones disponibles.</p>
        </div>
      )}
    </div>
  );
};
