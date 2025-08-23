import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PluginState = {
  pluginWrapper: HTMLElement | null;
  pluginIframe: HTMLIFrameElement | null;
};

type PluginAction = {
  setPluginWrapper: (pluginWrapper: HTMLElement | null) => void;
  setPluginIframe: (pluginIframe: HTMLIFrameElement | null) => void;
};

type PluginStore = PluginState & PluginAction;

export const usePluginStore = create<PluginStore>()(
  devtools(
    (set) => ({
      pluginWrapper: null,
      pluginIframe: null,
      setPluginWrapper: (pluginWrapper) =>
        set({ pluginWrapper: pluginWrapper }, undefined, 'setPluginWrapper'),
      setPluginIframe: (pluginIframe) =>
        set({ pluginIframe: pluginIframe }, undefined, 'setPluginIframe'),
    }),
    {
      name: 'PluginStore',
    },
  ),
);
