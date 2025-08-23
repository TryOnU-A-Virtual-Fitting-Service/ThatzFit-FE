import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PluginEntryState = {
  entryWrapper: HTMLElement | null;
};

type PluginEntryAction = {
  setEntryWrapper: (entryWrapper: HTMLElement | null) => void;
};

type PluginEntryStore = PluginEntryState & PluginEntryAction;

export const usePluginEntryStore = create<PluginEntryStore>()(
  devtools(
    (set) => ({
      entryWrapper: null,
      setEntryWrapper: (entryWrapper) =>
        set({ entryWrapper: entryWrapper }, undefined, 'setEntryWrapper'),
    }),
    {
      name: 'PluginEntryStore',
    },
  ),
);
