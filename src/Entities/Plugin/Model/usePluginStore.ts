import { create } from 'zustand';

type PluginState = {
  pluginWrapper: HTMLElement | null;
};

type PluginAction = {
  setPluginWrapper: (pluginWrapper: HTMLElement | null) => void;
};

type PluginStore = PluginState & PluginAction;

export const usePluginStore = create<PluginStore>()((set) => ({
  pluginWrapper: null,
  setPluginWrapper: (pluginWrapper) => set({ pluginWrapper: pluginWrapper }),
}));
