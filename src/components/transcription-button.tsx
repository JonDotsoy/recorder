import type { FC } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";

export const TranscriptionButton: FC<{
  recordId?: string;
  onOpen?: () => void;
}> = ({ onOpen }) => {
  return (
    // <Dialog>
    //     <DialogTrigger asChild>
    <Button size={"sm"} variant={"outline"} onClick={() => onOpen?.()}>
      Transcribe
    </Button>
    //     </DialogTrigger>
    //     <DialogContent className="sm:max-w-[425px]">
    //         <DialogHeader>
    //             head
    //         </DialogHeader>

    //         <div>
    //             Content
    //         </div>

    //         <DialogFooter>
    //             <Button type="submit">Submit</Button>
    //         </DialogFooter>
    //     </DialogContent>
    // </Dialog>
  );
};
