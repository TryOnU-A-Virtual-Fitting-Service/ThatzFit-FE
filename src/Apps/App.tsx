import { useEffect } from 'react';

import { initializePlugin } from '@/Widgets/Plugin';
import { createPluginEntry } from '@/Widgets/PluginEntry';

import { PluginEntryButton } from '@/Features/PluginEntry';

import { initialCompanyInfo } from '@/Entities/Plugin';

import { Toast, ToastProvider } from '@/Shared/Ui';

import { PluginRouter } from './Ui/PluginRouter';
import { TanstackQueryProvider } from './Ui/TanstackQueryProvider';
import { initializeThatzfitStyle, initUserInfo } from './Model';

export const App = () => {
  useEffect(() => {
    initializeThatzfitStyle();
    createPluginEntry();
    initializePlugin();
    initUserInfo();
    initialCompanyInfo();
  }, []);

  return (
    <TanstackQueryProvider>
      <ToastProvider>
        <PluginRouter />
        <PluginEntryButton />
        <Toast />
      </ToastProvider>
    </TanstackQueryProvider>
  );
};
