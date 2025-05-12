import type { FC } from "react";
import type { RecordDTO } from "../dtos/record-dto";
import { transcribeMedia } from "../../backup-service/controllers/transcribe-media";

export const TranscribeButton: FC<{ record: RecordDTO }> = ({ record }) => {
  const f = () => {
    transcribeMedia(record)
      .then(() => {
        console.log("Transcription successful");
      })
      .catch((error) => {
        console.error("Error during transcription:", error);
      });
  };

  return (
    <>
      <button
        className="border px-4 py-1 rounded hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => f()}
      >
        Transcribe
      </button>
    </>
  );
};
