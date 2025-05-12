import { useStore } from "@nanostores/react";
import { recordingState } from "./recordingState";
import {
  createRecordingControl,
  startScreenRecordingWithAudio,
  type RecordingControl,
} from "./recorder/recorder";
import { atom } from "nanostores";
import { useCallback, useState } from "react";
import { recordsListVersionState } from "./list-records-state";
import { storingRecordState } from "./storing-record.state";
import { InputSyncState } from "./input-sync-state";
import { Button } from "@/components/ui/button";
import { Loader2, Circle } from "lucide-react";

export const recordingControlState = atom<null | RecordingControl>(null);

export const RecordController = () => {
  const recording = useStore(recordingState);
  const storing = useStore(storingRecordState);
  const recordingControl = useStore(recordingControlState);
  const [error, setError] = useState<string | null>(null);

  const handleClickStop = () => {
    if (recording) {
      recordingControl?.stop();
      return;
    }
  };

  const handleClick = useCallback(() => {
    if (recording) {
      recordingControl?.stop();
      return;
    }
    const newRecordingControl = createRecordingControl();
    recordingControlState.set(newRecordingControl);
    setError(null);
    startScreenRecordingWithAudio(newRecordingControl)
      .catch((err) => {
        setError(
          `Error al iniciar la grabación: ${typeof err === "string" ? err : err instanceof Error ? err.message : "Error desconocido"}`,
        );
        console.error(err);
      })
      .finally(() => {
        recordsListVersionState.set(Date.now());
      });
  }, [recording, recordingControl]);

  return (
    <div className="container mx-auto py-4 px-4 md:grid md:grid-cols-[1fr_auto] md:gap-4">
      <div className="">
        <div className="flex flex-row gap-2">
          {!recording && !storing && (
            <Button
              className="border px-4 py-2 rounded cursor-pointer"
              disabled={recording}
              onClick={handleClick}
              size={"sm"}
              variant={"ghost"}
            >
              <Circle className="stroke-green-500 animate-pulse" /> Iniciar grabación
            </Button>
          )}
          {storing && (
            <>
              <Button
                className="border px-4 py-2 rounded cursor-pointer"
                disabled={true}
                size={"sm"}
                variant={"ghost"}
              >
                <Loader2 className="animate-spin" /> Almacenando
              </Button>
            </>
          )}
          {recording && (
            <>
              <Button
                className="border px-4 py-2 rounded cursor-pointer"
                disabled={true}
                size={"sm"}
                variant={"ghost"}
              >
                <Loader2 className="animate-spin" /> Grabando
              </Button>
              <Button size={"sm"} onClick={() => handleClickStop()}>
                Stop
              </Button>
            </>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {recording && <p className="text-green-500 mt-2">Grabando...</p>}
        {storing && <p className="text-yellow-500 mt-2">Almacenando...</p>}
      </div>
      <div>
        <InputSyncState></InputSyncState>
      </div>
    </div>
  );
};
