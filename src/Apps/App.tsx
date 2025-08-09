import { useEffect } from 'react';

import { initializeThatzfitStyle } from '@/Apps/Model/initializeThatzfitStyle';

import { FittingPage } from '@/Pages/Plugin';

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
    <>
      <FittingPage />
      <PluginEntryButton />
    </>
  );
};
