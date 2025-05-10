import { useStore } from "@nanostores/react";
import { useState, type FC } from "react";
import { serviceAvailabilityState } from "../../backup-service/states/service-availability.js";
import type { RecordDTO } from "../dtos/record-dto.js";
import { syncContent } from "../../backup-service/controllers/push-media.js";

enum BackupStatus {
  PENDING,
  IN_PROGRESS,
  READY,
  ERROR
}

/**
 * A functional component that renders a backup button.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.key - A unique key associated with the backup operation.
 * @param {RecordDTO} props.data - The data object to be backed up.
 * @returns {JSX.Element} A button element that triggers the backup operation.
 *
 * @remarks
 * - The button is disabled if the service is unavailable, as determined by the `serviceAvailabilityState` store.
 * - The button has styling for hover effects and disabled states.
 *
 * @example
 * ```tsx
 * <BackupButton key="unique-key" data={recordData} />
 * ```
 */

export const BackupButton: FC<{ record: RecordDTO; }> = ({ record }) => {
  const isServiceAvailability = useStore(serviceAvailabilityState);
  const [backupReady, setBackupReady] = useState<BackupStatus>(BackupStatus.PENDING);

  const f = () => {
    if (backupReady !== BackupStatus.PENDING) {
      return;
    }
    setBackupReady(BackupStatus.IN_PROGRESS);
    syncContent(record)
      .then(() => {
        setBackupReady(BackupStatus.READY);
      })
      .catch((error) => {
        console.error("Error syncing content:", error);
        setBackupReady(BackupStatus.ERROR);
      })
  };

  return (
    <button
      className="border px-4 py-1 rounded hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => f()}
      disabled={!isServiceAvailability}
    >
      {backupReady === BackupStatus.READY ? "Backup Ready" : "Backup"}
      {backupReady === BackupStatus.IN_PROGRESS && (
        <span className="animate-pulse">...</span>
      )}
    </button>
  );
};
