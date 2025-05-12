import { atom } from "nanostores";
import { recording } from "../db/models/recording";
import { type RecordDTO } from "../dtos/record-dto";
import { recordsListVersionState } from "../list-records-state";

export const recordsListState = atom<RecordDTO[] | null>(null);
recordsListVersionState.subscribe(() => {
  Array.fromAsync(recording.list()).then((records) => {
    recordsListState.set(records);
  });
});
