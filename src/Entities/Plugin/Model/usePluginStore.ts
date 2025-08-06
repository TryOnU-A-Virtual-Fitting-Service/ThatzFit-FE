import { create } from 'zustand';

type PluginState = {
  pluginWrapper: HTMLElement | null;
  pluginIframe: HTMLIFrameElement | null;
};

type PluginAction = {
  setPluginWrapper: (pluginWrapper: HTMLElement | null) => void;
  setPluginIframe: (pluginIframe: HTMLIFrameElement | null) => void;
};

type PluginStore = PluginState & PluginAction;

export const usePluginStore = create<PluginStore>()((set) => ({
  pluginWrapper: null,
  pluginIframe: null,
  setPluginWrapper: (pluginWrapper) => set({ pluginWrapper: pluginWrapper }),
  setPluginIframe: (pluginIframe) => set({ pluginIframe: pluginIframe }),
}));
