import { useStore } from "@nanostores/react";
import { recordingState } from "./recordingState";
import { createRecordingControl, startScreenRecordingWithAudio, type RecordingControl } from "../recorder/recorder";
import { atom } from "nanostores";
import { useCallback, useState } from "react";
import { recordsListVersionState } from "./list-records-state";

export const recordingControlState = atom<null | RecordingControl>(null);

export const RecordController = () => {
    const recording = useStore(recordingState);
    const recordingControl = useStore(recordingControlState);
    const [error, setError] = useState<string | null>(null);

    const handleClick = useCallback(() => {
        if (recording) {
            recordingControl?.stop();
            return;
        }
        const newRecordingControl = createRecordingControl();
        recordingControlState.set(newRecordingControl);
        setError(null);
        startScreenRecordingWithAudio(newRecordingControl)
            .catch(err => {
                setError(`Error al iniciar la grabación: ${typeof err === 'string' ? err : err instanceof Error ? err.message : 'Error desconocido'}`);
                console.error(err)
            })
            .finally(() => {
                recordsListVersionState.set(Date.now());
            });
    }, [recording, recordingControl]);

    return (
        <div className="container mx-auto p-4">
            <div className="p-4">
                <button className="border px-4 py-2 rounded cursor-pointer" onClick={handleClick}>{recording ? 'Detener' : 'Grabar'}</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {recording && <p className="text-green-500 mt-2">Grabando...</p>}
            </div>
        </div>
    )
}