import { create } from 'zustand';

type PluginEntryState = {
  entryWrapper: HTMLElement | null;
};

type PluginEntryAction = {
  setEntryWrapper: (entryWrapper: HTMLElement | null) => void;
};

type PluginEntryStore = PluginEntryState & PluginEntryAction;

export const usePluginEntryStore = create<PluginEntryStore>()((set) => ({
  entryWrapper: null,
  setEntryWrapper: (entryWrapper) => set({ entryWrapper: entryWrapper }),
}));
