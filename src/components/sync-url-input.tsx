import type { FC } from "react";
import { Input } from "./ui/input.js";

export const SyncUrlInput: FC<{ a?: string }> = () => {
    return (
        <div className="flex flex-col gap-2">
            <Input
                type="text"
                id="sync-url"
                name="sync-url"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/sync"
            />
        </div>
    );
}