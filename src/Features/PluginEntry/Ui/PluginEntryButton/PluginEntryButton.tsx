import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { trackProductEvent } from '@/Shared/Analytics';
import { PLUGIN_ENTRY_BOTTOM, PLUGIN_ENTRY_HINT_BOTTOM } from '@/Shared/Config';
import { cn, getHostPageUrl } from '@/Shared/Lib';

import { PluginActivateButton } from '../PluginActivateButton';
import { PluginDeactivateButton } from '../PluginDeactivateButton';

const entryButtonPositionStyle: CSSProperties = {
  position: 'fixed',
  right: '24px',
  bottom: PLUGIN_ENTRY_BOTTOM,
  zIndex: 1000001,
  width: '48px',
  height: '48px',
};

const entryButtonBaseStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
  borderRadius: '16px',
  cursor: 'pointer',
};

const entryButtonStyle: CSSProperties = {
  ...entryButtonBaseStyle,
  background: 'transparent',
};

const closeButtonStyle: CSSProperties = {
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
    const nextIsPluginOpen = !isPluginOpen;
    setIsEntryHintDismissed(true);
    setIsPluginOpen(nextIsPluginOpen);
    trackProductEvent(nextIsPluginOpen ? 'plugin_opened' : 'plugin_closed', {
      host_page_url: getHostPageUrl(),
    });
  };

  return createPortal(
    <>
      <style>
        {`
          @keyframes thatzfit-entry-hint-float {
            0%, 100% { transform: translate(-4px, -4px); opacity: 0.92; }
            50% { transform: translate(3px, 3px); opacity: 1; }
          }

          @keyframes thatzfit-entry-hint-pulse {
            0%, 100% { opacity: 0.18; transform: scale(0.84); }
            50% { opacity: 0.34; transform: scale(1.08); }
          }
        `}
      </style>
      {!isPluginOpen && !isEntryHintDismissed && (
        <div
          aria-hidden='true'
          data-thatzfit-entry-hint='true'
          style={{
            position: 'fixed',
            right: '56px',
            bottom: PLUGIN_ENTRY_HINT_BOTTOM,
            zIndex: 1000000,
            width: '96px',
            height: '78px',
            pointerEvents: 'none',
            animation: 'thatzfit-entry-hint-float 1.1s ease-in-out infinite',
            filter: 'drop-shadow(0 10px 16px rgba(220, 38, 38, 0.28))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-5px',
              bottom: '-5px',
              width: '44px',
              height: '44px',
              borderRadius: '9999px',
              background: '#ef4444',
              animation: 'thatzfit-entry-hint-pulse 1.05s ease-in-out infinite',
            }}
          />
          <svg
            viewBox='0 0 96 78'
            role='presentation'
            style={{
              position: 'relative',
              display: 'block',
              width: '96px',
              height: '78px',
              overflow: 'visible',
            }}
          >
            <path
              d='M9.45 12.32C36.88 9.1 62.72 24.24 75.41 49.17L85.07 36.72L93.47 76.61L55.7 61.3L70.05 55.16C59.75 34.78 37.58 22.18 11.31 25.26C7.74 25.68 4.5 23.13 4.08 19.56C3.66 15.99 5.88 12.74 9.45 12.32Z'
              fill='#ef4444'
              fillRule='evenodd'
            />
          </svg>
        </div>
      )}
      <div data-thatzfit-entry-position='true' style={entryButtonPositionStyle}>
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
      </div>
    </>,
    entryWrapper,
  );
};
