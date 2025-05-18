import { SyncUrlInput } from "@/components/sync-url-input";
import { atom, readonlyType } from "nanostores";
import type { FC } from "react";
import { action } from "@storybook/addon-actions";

export const SyncUrlInputControl: FC<{
  urlSync?: string;
  connected?: boolean;
  syncing?: boolean;
}> = ({ urlSync, connected, syncing }) => {
  return (
    <SyncUrlInput
      serviceURL={atom(urlSync ?? "")}
      connected={atom(connected)}
      syncing={atom(syncing)}
      onUpdateUrl={(url) => {
        action("updateUrl")?.(url);
      }}
    />
  );
};
