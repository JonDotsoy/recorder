import { useStore } from "@nanostores/react";
import { updateUrl } from "../../backup-service/states/updateUrl.js";
import { syncing as syncingState } from "../../backup-service/states/syncing.js";
import { serviceAvailabilityState as serviceAvailabilityState } from "../../backup-service/states/service-availability.js";
import { serviceURL as urlState } from "../../backup-service/states/service-url.js";
import classNames from "classnames";

export const InputSyncState = () => {
  const url = useStore(urlState);
  const serviceAvailability = useStore(serviceAvailabilityState);
  const syncing = useStore(syncingState);

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full"
          placeholder="URL del servicio de respaldo"
          defaultValue={url?.toString() ?? ""}
          onChange={(e) => {
            updateUrl(e.target.value);
          }}
        />
        <button
          className={classNames("border px-4 py-2 rounded", {
            "bg-green-100": serviceAvailability,
            "bg-gray-100": !serviceAvailability,
          })}
        >
          <span className="animate-pulse">a</span>
        </button>
      </div>
    </>
  );
};
