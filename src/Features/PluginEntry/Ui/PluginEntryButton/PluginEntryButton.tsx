import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

const entryButtonStyle: CSSProperties = {
  position: 'fixed',
  right: '24px',
  bottom: '24px',
  zIndex: 999999,
  width: '64px',
  height: '64px',
  padding: 0,
  border: 0,
  borderRadius: '16px',
  background: 'transparent',
  cursor: 'pointer',
};

const closeButtonStyle: CSSProperties = {
  ...entryButtonStyle,
  width: '48px',
  height: '48px',
  padding: '12px',
  background: '#ffffff',
  color: '#636364',
};

export const PluginEntryButton = () => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);

  const { pluginWrapper, setIsPluginOpen, isPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
      isPluginOpen: state.isPluginOpen,
    })),
  );

  useEffect(() => {
    if (!pluginWrapper) {
      return;
    }

    pluginWrapper.classList.toggle('thatzfit-visible', isPluginOpen);
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
        style={closeButtonStyle}
        onClick={handleClickEntryButton}
      />
    ) : (
      <PluginActivateButton
        className={cn(
          'fixed right-5 bottom-5 z-[9999] h-12 w-12 cursor-pointer transition-opacity duration-300 ease-in-out',
          isPluginOpen ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          ...entryButtonStyle,
          display: isPluginOpen ? 'none' : undefined,
        }}
        onClick={handleClickEntryButton}
      />
    ),
    entryWrapper,
  );
};
