import { useEffect } from 'react';

import { initializePlugin } from '@/Widgets/Plugin';
import { createPluginEntry } from '@/Widgets/PluginEntry';

import { PluginEntryButton } from '@/Features/PluginEntry';

import { ToastProvider } from '@/Shared/Ui';

import { PluginRouter } from './Ui/PluginRouter';
import { TanstackQueryProvider } from './Ui/TanstackQueryProvider';
import { initializeThatzfitStyle, initUserInfo } from './Model';

export const App = () => {
  useEffect(() => {
    initializeThatzfitStyle();
    createPluginEntry();
    initializePlugin();
    initUserInfo();
  }, []);

  return (
    <TanstackQueryProvider>
      <ToastProvider>
        <PluginRouter />
        <PluginEntryButton />
      </ToastProvider>
    </TanstackQueryProvider>
  );
};
