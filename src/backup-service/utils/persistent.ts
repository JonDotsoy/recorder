import { type ReadableAtom } from "nanostores";
import { PERSISTENT_MODE_ACTIVED } from "../constants/PERSISTENT_MODE_ACTIVED.js";

/**
 * A utility function to manage persistent storage in the browser's `localStorage`.
 * Provides methods to get, set, remove, and subscribe to changes for a specific key.
 *
 * @template T - The type of the value to be stored or retrieved. Defaults to `any`.
 * @param {string} key - The key used to store and retrieve the value in `localStorage`.
 * @returns {{
 *   get: () => T | null;
 *   set: (value: T) => void;
 *   remove: () => void;
 *   subscribeAtom: (atom: ReadableAtom<T>) => () => void;
 * }} 
 * 
 * An object containing methods to interact with the persistent storage:
 * - `get`: Retrieves the value associated with the key. Returns `null` if the key does not exist or if `PERSISTENT_MODE_ACTIVED` is not enabled.
 * - `set`: Stores a value associated with the key in `localStorage`.
 * - `remove`: Removes the value associated with the key from `localStorage`.
 * - `subscribeAtom`: Subscribes to changes in a `ReadableAtom` and updates the persistent storage whenever the atom's value changes.
 */
export const persistent = <T = any>(key: string) => {
    const get = (): T | null => {
        if (!PERSISTENT_MODE_ACTIVED) return null;

        const value = localStorage.getItem(key);
        if (value === null) return null;
        return JSON.parse(value);
    };

    const set = (value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const remove = () => {
        localStorage.removeItem(key);
    };

    const subscribeAtom = (atom: ReadableAtom<T>) => {
        return atom.listen((value) => {
            set(value);
        });
    };

    return {
        get,
        set,
        remove,
        subscribeAtom,
    };
};


