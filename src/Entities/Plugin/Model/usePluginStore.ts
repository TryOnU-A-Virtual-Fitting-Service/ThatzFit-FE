import { create } from 'zustand';

type PluginState = {
  PluginWrapper: HTMLElement | null;
};

type PluginAction = {
  setPluginWrapper: (pluginWrapper: HTMLElement | null) => void;
};

type PluginStore = PluginState & PluginAction;

export const usePluginStore = create<PluginStore>()((set) => ({
  PluginWrapper: null,
  setPluginWrapper: (pluginWrapper) => set({ PluginWrapper: pluginWrapper }),
}));
