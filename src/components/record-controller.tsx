import { useStore } from "@nanostores/react";
import { recordingState } from "./recordingState";
import { createRecordingControl, startScreenRecordingWithAudio, type RecordingControl } from "../recorder/recorder";
import { atom } from "nanostores";
import { useCallback } from "react";

export const recordingControlState = atom<null | RecordingControl>(null);

export const RecordController = () => {
    const recording = useStore(recordingState);
    const recordingControl = useStore(recordingControlState);

    const handleClick = useCallback(() => {
        if (recording) {
            recordingControl?.stop();
            return;
        }
        const newRecordingControl = createRecordingControl();
        recordingControlState.set(newRecordingControl);
        startScreenRecordingWithAudio(newRecordingControl).catch(err => console.error(err));
    }, [recording, recordingControl]);

    return (
        <button className="border px-4 py-2 rounded cursor-pointer" onClick={handleClick}>{recording ? 'Detener' : 'Grabar'}</button>
    )
}