import { create } from 'zustand';

type PluginEntryState = {
  EntryWrapper: HTMLElement | null;
};

type PluginEntryAction = {
  setEntryWrapper: (entryWrapper: HTMLElement | null) => void;
};

type PluginEntryStore = PluginEntryState & PluginEntryAction;

export const usePluginEntryStore = create<PluginEntryStore>()((set) => ({
  EntryWrapper: null,
  setEntryWrapper: (entryWrapper) => set({ EntryWrapper: entryWrapper }),
}));
