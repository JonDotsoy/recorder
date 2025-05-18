import type { FC } from "react";
import { Input } from "./ui/input.js";
import { type WritableAtom, type ReadableAtom } from "nanostores";
import { Badge, badgeVariants } from "./ui/badge.js";
import { serviceURLState } from "@/backup-service/states/service-url.state.js";
import { useStore } from "@nanostores/react";
import { syncingState } from "@/backup-service/states/syncing.js";
import { updateUrl } from "@/backup-service/states/updateUrl.js";
import classNames from "classnames";

export const SyncUrlInput: FC<{
  serviceURL?: ReadableAtom<string>;
  connected?: ReadableAtom<boolean>;
  syncing?: ReadableAtom<boolean>;
  onUpdateUrl?: (url: string) => void;
}> = ({
  serviceURL = serviceURLState,
  connected,
  syncing = syncingState,
  onUpdateUrl: onUpdateUrl = updateUrl,
}) => {
  const isSyncing = useStore(syncing);

  return (
    <div x-name="sd" className="flex flex-col">
      <Input
        type="text"
        id="sync-url"
        name="sync-url"
        placeholder="https://example.com/sync"
        defaultValue={serviceURL?.get()?.toString() ?? ""}
        onChange={(e) => {
          onUpdateUrl?.(e.target.value);
        }}
      />
      <span className="flex items-center gap-2">
        <Badge
          className={classNames(badgeVariants({ variant: "secondary" }), {
            "bg-green-200": connected?.get(),
          })}
        >
          {connected?.get() ? "Connected" : "Not Connected"}
        </Badge>
        {isSyncing && (
          <Badge variant="secondary" className="animate-pulse">
            Syncing...
          </Badge>
        )}
      </span>
    </div>
  );
};
