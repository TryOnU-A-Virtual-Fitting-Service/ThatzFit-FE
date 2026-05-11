export const initializeThatzfitStyle = () => {
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
      bottom: 72px !important;
      right: 24px !important;
      width: min(15rem, calc(100vw - 2rem)) !important;
      height: min(570px, calc(100dvh - 104px)) !important;
      z-index: 999999 !important;
      display: block !important;
      background-color: transparent !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15) !important;
    }

    @supports not (height: 100dvh) {
      .thatzfit-desktop {
        height: min(570px, calc(100vh - 104px)) !important;
      }
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
};
