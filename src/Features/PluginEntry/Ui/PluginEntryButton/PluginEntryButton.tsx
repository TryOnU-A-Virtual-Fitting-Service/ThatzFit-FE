import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

export const PluginEntryButton = () => {
  const EntryWrapper = usePluginEntryStore((state) => state.EntryWrapper);
  const PluginWrapper = usePluginStore((state) => state.PluginWrapper);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!PluginWrapper) {
      return;
    }

    PluginWrapper.classList.toggle('thatzfit-visible', isOpen);
    PluginWrapper.classList.toggle('thatzfit-hidden', !isOpen);
  }, [isOpen, PluginWrapper]);

  if (!EntryWrapper) {
    return null;
  }

  const handleClickEntryButton = () => {
    setIsOpen((prev) => !prev);
  };

  return createPortal(
    isOpen ? (
      <PluginDeactivateButton
        className='fixed right-5 bottom-5 z-[9999] h-10 w-10 cursor-pointer bg-white p-2.5 text-[#636364] hover:bg-white'
        onClick={handleClickEntryButton}
      />
    ) : (
      <PluginActivateButton
        className={cn(
          'fixed right-5 bottom-5 z-[9999] h-12 w-12 cursor-pointer transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-0' : 'opacity-100',
        )}
        onClick={handleClickEntryButton}
      />
    ),
    EntryWrapper,
  );
};
