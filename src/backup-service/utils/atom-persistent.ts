import { atom } from "nanostores";
import { persistent } from "./persistent";

/**
 * Creates a persistent Recoil atom that synchronizes its state with a persistent storage.
 *
 * @template T - The type of the atom's value.
 * @param key - A unique key used to identify the persistent storage entry.
 * @param initialValue - The initial value of the atom if no value exists in persistent storage.
 * @returns A Recoil atom that is synchronized with persistent storage.
 *
 * @remarks
 * This utility integrates a persistent storage mechanism with Recoil atoms.
 * It initializes the atom with a value from persistent storage (if available),
 * or falls back to the provided `initialValue`. Changes to the atom's state
 * are automatically synchronized with the persistent storage.
 *
 * @example
 * ```typescript
 * const userPreferencesAtom = atomPersistent('userPreferences', { theme: 'light' });
 * ```
 */
export const atomPersistent = <T = any>(key: string, initialValue: T) => {
  const persistentStore = persistent<T>(key);
  const storedValue = persistentStore.get() ?? initialValue;
  console.debug(
    `[atomPersistent] Start persistent store with key: ${key} and initial value:`,
    storedValue,
  );
  const state = atom<T>(storedValue);
  persistentStore.subscribeAtom(state);
  return state;
};
