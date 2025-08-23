import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { usePostUserInfo } from '@/Features/User';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';
import { getUserToken } from '@/Entities/User';

import { cn } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

export const PluginEntryButton = () => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const pluginWrapper = usePluginStore((state) => state.pluginWrapper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const firstRender = useRef<boolean>(true);
  const { mutate: postUserInfo } = usePostUserInfo();

  useEffect(() => {
    if (!pluginWrapper) {
      return;
    }

    pluginWrapper.classList.toggle('thatzfit-visible', isOpen);
    pluginWrapper.classList.toggle('thatzfit-hidden', !isOpen);
  }, [isOpen, pluginWrapper]);

  if (!entryWrapper) {
    return null;
  }

  const handleClickEntryButton = () => {
    setIsOpen((prev) => !prev);
    if (firstRender.current) {
      postUserInfo({
        uuid: getUserToken(),
      });
      firstRender.current = false;
    }
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
    entryWrapper,
  );
};
