import { useEffect } from 'react';

import { initializeThatzfitStyle } from '@/Apps/Model/initializeThatzfitStyle';

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
      <div className='text-red bg-blue text-3xl font-bold underline'>
        Hello World
      </div>
      <PluginEntryButton />
    </>
  );
};
