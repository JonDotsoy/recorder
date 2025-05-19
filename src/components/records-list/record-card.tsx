import type { FC } from "react";
import { BackupButton } from "./backup-button";
import type { RecordDTO } from "../dtos/record-dto";
import { BytesFormat } from "@jondotsoy/utils-js/bytes-format";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TranscriptionButton } from "../transcription-button";

/**
 * Displays a card with information and actions for a single audio record.
 *
 * The component renders the record's key and size, and provides buttons for downloading, playing, deleting (with confirmation dialog), backing up, and viewing the transcription.
 */
export const RecordCard: FC<{
  /** The record data to display, including metadata and file size. */
  record: RecordDTO;
  /** Optional callback invoked when the user clicks the "Download" button. Receives the record key as an argument. */
  onDownloadRecord?: (key: string) => void | Promise<void>;
  /** Optional callback invoked when the user clicks the "Play" button. Receives the record key as an argument. */
  onPlayRecord?: (key: string) => void | Promise<void>;
  /** Optional callback invoked when the user confirms deletion in the dialog. Receives the record key as an argument. */
  onDeleteRecord?: (key: string) => void | Promise<void>;
  /** Optional callback invoked when the user requests to view the transcription. Receives the record key as an argument. */
  onOpenTranscription?: (key: string) => void | Promise<void>;
}> = ({
  record,
  onDownloadRecord: downloadRecord,
  onPlayRecord: playRecord,
  onDeleteRecord: deleteRecord,
  onOpenTranscription: openTranscription,
}) => {
  return (
    <Card key={record.key}>
      <CardHeader>
        <CardTitle>{record.key}</CardTitle>
        <CardDescription>
          {new BytesFormat(undefined, { unitDisplay: "long" }).format(
            record.data.size,
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-1">
          <Button
            className="border px-4 py-1 rounded hover:shadow cursor-pointer"
            onClick={() => downloadRecord?.(record.key)}
            size={"sm"}
            variant={"outline"}
          >
            Download
          </Button>
          <Button
            className="border px-4 py-1 rounded hover:shadow cursor-pointer"
            onClick={() => playRecord?.(record.key)}
            size={"sm"}
            variant={"outline"}
          >
            Play
          </Button>
          <Button
            className="border px-4 py-1 rounded hover:shadow cursor-pointer"
            size={"sm"}
            variant={"outline"}
          >
            <AlertDialog>
              <AlertDialogTrigger>Eliminar</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteRecord?.(record.key)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Button>
          <BackupButton key={record.key} record={record} />
          <TranscriptionButton onOpen={() => openTranscription?.(record.key)} />
        </div>
      </CardContent>
    </Card>
  );
};
