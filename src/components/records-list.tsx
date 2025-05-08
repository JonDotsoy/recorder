import { useStore } from "@nanostores/react";
import { recordsListState } from "./recordsListState";
import { BytesFormat } from "./utils/bytes-format";

export const RecordList = () => {
  const records = useStore(recordsListState);

  const h = (key: string) => {
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

  const p = (key: string) => {
    const record = records?.find((record) => record.key === key);
    if (!record) return;
    const { data } = record;
    const u = URL.createObjectURL(new Blob([data], { type: data.type }));
    window.open(u, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(u);
    }, 10_000);
  };

  const d = (key: string) => {
    confirm("¿Estás seguro de que quieres eliminar este registro?");
  };

  return (
    <div className="container mx-auto p-4">
      {records
        ?.sort((a, b) => b.timestamp - a.timestamp)
        ?.map((record) => (
          <div
            className="grid grid-cols-[1fr_auto] gap-4 border-b border-gray-200"
            key={record.key}
          >
            <div key={record.key} className="flex flex-col gap-2 p-4">
              <h3 className="text-xl">{record.key}</h3>
              <p className="text-gray-500">
                {new Date(record.timestamp).toLocaleString(undefined, {
                  timeStyle: "full",
                  dateStyle: "full",
                })}
              </p>
              <p className="text-gray-500">
                {new BytesFormat(undefined, { unitDisplay: "long" }).format(
                  record.data.size,
                )}
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button
                className="border px-4 py-1 rounded hover:shadow cursor-pointer"
                onClick={() => h(record.key)}
              >
                Download
              </button>
              <button
                className="border px-4 py-1 rounded hover:shadow cursor-pointer"
                onClick={() => p(record.key)}
              >
                Play
              </button>
              <button
                className="border px-4 py-1 rounded hover:shadow cursor-pointer"
                onClick={() => d(record.key)}
              >
                Eliminar
              </button>
            </div>
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
