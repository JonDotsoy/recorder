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

export const RecordCard: FC<{
  record: RecordDTO;
  onDownloadRecord: (key: string) => void;
  onPlayRecord: (key: string) => void;
  onDeleteRecord: (key: string) => void;
}> = ({
  record,
  onDownloadRecord: downloadRecord,
  onPlayRecord: playRecord,
  onDeleteRecord: deleteRecord,
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
            onClick={() => downloadRecord(record.key)}
            size={"sm"}
            variant={"outline"}
          >
            Download
          </Button>
          <Button
            className="border px-4 py-1 rounded hover:shadow cursor-pointer"
            onClick={() => playRecord(record.key)}
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
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Button>
          <BackupButton key={record.key} record={record} />
          {/* <TranscribeButton key={record.key} record={record} /> */}
        </div>
      </CardContent>
    </Card>
  );
};
