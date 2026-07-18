import { PLUGIN_PANEL_BOTTOM } from '@/Shared/Config';

const PLUGIN_WIDTH = 240;
const PLUGIN_HEIGHT = 570;
const PLUGIN_HORIZONTAL_MARGIN = 32;
const PLUGIN_VERTICAL_MARGIN = 104;

type ThatzfitParentWindow = Window &
  typeof globalThis & {
    __thatzfitUpdatePluginScale?: () => void;
  };

export const initializeThatzfitStyle = () => {
  const parentWindow = window.parent as ThatzfitParentWindow;
  const parentDocument = window.parent.document;
  const style =
    parentDocument.getElementById('thatzfit-runtime-style') ??
    parentDocument.createElement('style');
  style.id = 'thatzfit-runtime-style';
  style.textContent = `
    #thatzfit-plugin {
      position: static !important;
      display: block !important;
      width: 0 !important;
      height: 0 !important;
    }

    #thatzfit-entry {
      position: static !important;
      display: block !important;
      width: 0 !important;
      height: 0 !important;
    }

    .thatzfit-desktop {
      position: fixed !important;
      bottom: ${PLUGIN_PANEL_BOTTOM} !important;
      right: 24px !important;
      width: 240px !important;
      height: 570px !important;
      z-index: 999999 !important;
      display: block !important;
      background-color: transparent !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15) !important;
      transform: scale(var(--thatzfit-plugin-scale, 1)) !important;
      transform-origin: right bottom !important;
      will-change: transform !important;
    }

    #thatzfit-iframe {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      background-color: transparent !important;
      border-radius: 0.75rem !important;
    }

    .thatzfit-hidden {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    @keyframes thatzfit-desktop-animation {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .thatzfit-visible {
      visibility: visible !important;
      pointer-events: auto !important;
      animation: thatzfit-desktop-animation 0.3s ease-in-out;
    }
  `;

  if (!style.parentNode) {
    parentDocument.head.appendChild(style);
  }

  const updatePluginScale = () => {
    const viewportWidth =
      parentWindow.visualViewport?.width ??
      parentWindow.innerWidth ??
      parentDocument.documentElement.clientWidth;
    const viewportHeight =
      parentWindow.visualViewport?.height ??
      parentWindow.innerHeight ??
      parentDocument.documentElement.clientHeight;
    const availableWidth = Math.max(
      viewportWidth - PLUGIN_HORIZONTAL_MARGIN,
      1,
    );
    const availableHeight = Math.max(
      viewportHeight - PLUGIN_VERTICAL_MARGIN,
      1,
    );
    const nextScale = Math.min(
      1,
      availableWidth / PLUGIN_WIDTH,
      availableHeight / PLUGIN_HEIGHT,
    );

    parentDocument.documentElement.style.setProperty(
      '--thatzfit-plugin-scale',
      nextScale.toFixed(4),
    );
  };

  const previousUpdatePluginScale = parentWindow.__thatzfitUpdatePluginScale;
  if (previousUpdatePluginScale) {
    parentWindow.removeEventListener('resize', previousUpdatePluginScale);
    parentWindow.visualViewport?.removeEventListener(
      'resize',
      previousUpdatePluginScale,
    );
  }

  parentWindow.__thatzfitUpdatePluginScale = updatePluginScale;
  updatePluginScale();
  parentWindow.addEventListener('resize', updatePluginScale, {
    passive: true,
  });
  parentWindow.visualViewport?.addEventListener('resize', updatePluginScale, {
    passive: true,
  });
};
