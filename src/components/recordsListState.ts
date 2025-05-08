import { atom } from "nanostores";
import { recording, type RecordDTO } from "./db";
import { recordsListVersionState } from "./list-records-state";

export const recordsListState = atom<RecordDTO[] | null>(null);
recordsListVersionState.subscribe(() => {
  Array.fromAsync(recording.list()).then((records) => {
    recordsListState.set(records);
  });
});
