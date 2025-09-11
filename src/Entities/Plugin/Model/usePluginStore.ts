import { Underline } from 'lucide-react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PluginState = {
  pluginWrapper: HTMLElement | null;
  pluginIframe: HTMLIFrameElement | null;
  isPluginOpen: boolean;
  companyLogoUrl: string;
  companySloganUrl: string;
  pluginButtonImageUrl: string;
};

type PluginAction = {
  setPluginWrapper: (pluginWrapper: HTMLElement | null) => void;
  setPluginIframe: (pluginIframe: HTMLIFrameElement | null) => void;
  setIsPluginOpen: (isPluginOpen: boolean) => void;
  setCompanyInfo: (
    logoUrl: string,
    sloganUrl: string,
    pluginButtonImageUrl: string,
  ) => void;
};

type PluginStore = PluginState & PluginAction;

export const usePluginStore = create<PluginStore>()(
  devtools(
    (set) => ({
      pluginWrapper: null,
      pluginIframe: null,
      isPluginOpen: false,
      companyLogoUrl: '',
      companySloganUrl: '',
      pluginButtonImageUrl: '',
      setPluginWrapper: (pluginWrapper) =>
        set({ pluginWrapper: pluginWrapper }, undefined, 'setPluginWrapper'),
      setPluginIframe: (pluginIframe) =>
        set({ pluginIframe: pluginIframe }, undefined, 'setPluginIframe'),
      setIsPluginOpen: (isPluginOpen) =>
        set({ isPluginOpen: isPluginOpen }, undefined, 'setIsPluginOpen'),
      setCompanyInfo: (logoUrl, sloganUrl, pluginButtonImageUrl) =>
        set(
          {
            companyLogoUrl: logoUrl,
            companySloganUrl: sloganUrl,
            pluginButtonImageUrl: pluginButtonImageUrl,
          },
          undefined,
          'setCompanyInfo',
        ),
    }),
    {
      name: 'PluginStore',
    },
  ),
);
