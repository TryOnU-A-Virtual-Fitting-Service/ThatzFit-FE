import { useEffect } from 'react';

import { initializeThatzfitStyle } from '@/Apps/Model/initializeThatzfitStyle';
import { PluginRouter } from '@/Apps/Ui/PluginRouter';
import { TanstackQueryProvider } from '@/Apps/Ui/TanstackQueryProvider';

import { initializePlugin } from '@/Widgets/Plugin';
import { createPluginEntry } from '@/Widgets/PluginEntry';

import { PluginEntryButton } from '@/Features/PluginEntry';

export const App = () => {
  useEffect(() => {
    initializeThatzfitStyle();
    createPluginEntry();
    initializePlugin();
  }, []);

  return (
    <TanstackQueryProvider>
      <PluginRouter />
      <PluginEntryButton />
    </TanstackQueryProvider>
  );
};
