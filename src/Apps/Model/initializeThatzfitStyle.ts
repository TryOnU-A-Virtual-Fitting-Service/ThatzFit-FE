export const initializeThatzfitStyle = () => {
  const parentDocument = window.parent.document;
  const existingStyle = parentDocument.getElementById('thatzfit-runtime-style');

  if (existingStyle) {
    return;
  }

  const style = parentDocument.createElement('style');
  style.id = 'thatzfit-runtime-style';
  style.textContent = `
    .thatzfit-desktop {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 15rem;
      height: 570px;
      background-color: transparent;
      border-radius: 0.75rem;
      box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15);
    }

    #thatzfit-iframe {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      background-color: transparent !important;
      border-radius: 0.75rem !important;
    }

    .thatzfit-hidden {
      visibility: hidden;
    }

    @keyframes thatzfit-desktop-animation {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .thatzfit-visible {
      visibility: visible;
      animation: thatzfit-desktop-animation 0.3s ease-in-out;
    }
  `;

  parentDocument.head.appendChild(style);
};
