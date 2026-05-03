import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

const entryButtonPositionStyle: CSSProperties = {
  position: 'fixed',
  right: '24px',
  bottom: '24px',
  zIndex: 999999,
  width: '48px',
  height: '48px',
};

const entryButtonBaseStyle: CSSProperties = {
  padding: 0,
  border: 0,
  borderRadius: '16px',
  cursor: 'pointer',
};

const entryButtonStyle: CSSProperties = {
  ...entryButtonPositionStyle,
  ...entryButtonBaseStyle,
  background: 'transparent',
};

const closeButtonStyle: CSSProperties = {
  ...entryButtonPositionStyle,
  ...entryButtonBaseStyle,
  padding: '12px',
  background: '#ffffff',
  color: '#636364',
};

export const PluginEntryButton = () => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const [isEntryHintDismissed, setIsEntryHintDismissed] = useState(false);

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
    setIsEntryHintDismissed(true);
    setIsPluginOpen(!isPluginOpen);
  };

  return createPortal(
    <>
      <style>
        {`
          @keyframes thatzfit-entry-hint-float {
            0%, 100% { transform: translate(-6px, -4px); opacity: 0.9; }
            50% { transform: translate(4px, 4px); opacity: 1; }
          }

          @keyframes thatzfit-entry-hint-pulse {
            0%, 100% { opacity: 0.2; transform: scale(0.86); }
            50% { opacity: 0.42; transform: scale(1.12); }
          }
        `}
      </style>
      {!isPluginOpen && !isEntryHintDismissed && (
        <div
          aria-hidden='true'
          data-thatzfit-entry-hint='true'
          style={{
            position: 'fixed',
            right: '58px',
            bottom: '66px',
            zIndex: 1000000,
            width: '132px',
            height: '96px',
            pointerEvents: 'none',
            animation: 'thatzfit-entry-hint-float 1.05s ease-in-out infinite',
            filter: 'drop-shadow(0 10px 16px rgba(220, 38, 38, 0.28))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-8px',
              bottom: '-8px',
              width: '74px',
              height: '74px',
              borderRadius: '9999px',
              background: '#ef4444',
              animation: 'thatzfit-entry-hint-pulse 1.05s ease-in-out infinite',
            }}
          />
          <svg
            viewBox='0 0 132 96'
            role='presentation'
            style={{
              position: 'relative',
              display: 'block',
              width: '132px',
              height: '96px',
              overflow: 'visible',
            }}
          >
            <path
              d='M8 12C40 18 64 38 85 61'
              fill='none'
              stroke='#ef4444'
              strokeWidth='14'
              strokeLinecap='round'
            />
            <path d='M75 50L112 81L65 84Z' fill='#ef4444' />
          </svg>
        </div>
      )}
      {isPluginOpen ? (
        <PluginDeactivateButton
          className='cursor-pointer hover:bg-white'
          style={closeButtonStyle}
          onClick={handleClickEntryButton}
        />
      ) : (
        <PluginActivateButton
          className={cn(
            'cursor-pointer transition-opacity duration-300 ease-in-out',
            isPluginOpen ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            ...entryButtonStyle,
            display: isPluginOpen ? 'none' : undefined,
          }}
          onClick={handleClickEntryButton}
        />
      )}
    </>,
    entryWrapper,
  );
};
