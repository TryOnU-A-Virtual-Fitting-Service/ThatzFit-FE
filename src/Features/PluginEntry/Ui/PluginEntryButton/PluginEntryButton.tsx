import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

export const PluginEntryButton = () => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);

  const { pluginWrapper, setIsPluginOpen, isPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
      isPluginOpen: state.isPluginOpen,
    })),
  );

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (!pluginWrapper) {
      return;
    }

    pluginWrapper.classList.toggle('thatzfit-visible', isPluginOpen);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (pluginWrapper.classList.contains('thatzfit-initialHidden')) {
      pluginWrapper.classList.remove('thatzfit-initialHidden');
    }
    pluginWrapper.classList.toggle('thatzfit-hidden', !isPluginOpen);
  }, [isPluginOpen, pluginWrapper]);

  if (!entryWrapper) {
    return null;
  }

  const handleClickEntryButton = () => {
    setIsPluginOpen(!isPluginOpen);
  };

  return createPortal(
    isPluginOpen ? (
      <PluginDeactivateButton
        className='fixed right-5 bottom-5 z-[9999] h-10 w-10 cursor-pointer bg-white p-2.5 text-[#636364] hover:bg-white'
        onClick={handleClickEntryButton}
      />
    ) : (
      <PluginActivateButton
        className={cn(
          'fixed right-5 bottom-5 z-[9999] h-12 w-12 cursor-pointer transition-opacity duration-300 ease-in-out',
          isPluginOpen ? 'opacity-0' : 'opacity-100',
        )}
        onClick={handleClickEntryButton}
      />
    ),
    entryWrapper,
  );
};
