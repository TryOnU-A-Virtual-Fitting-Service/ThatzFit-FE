export const initializeThatzfitStyle = () => {
  try {
    const doc = window.parent.document;

    // 이미 스타일이 주입되었는지 확인하여 중복 주입 방지
    if (doc.getElementById('thatzfit-sdk-styles')) {
      return;
    }

    const styleElement = doc.createElement('style');
    styleElement.id = 'thatzfit-sdk-styles';
    styleElement.type = 'text/css';

    styleElement.textContent = `
      .thatzfit-desktop { 
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 15rem;
        height: 570px;
        background-color: transparent;
        border-radius: 0.75rem;
        box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15);
        will-change: visibility, width, max-width, max-height;
        z-index: 2147483647; /* 다른 요소보다 위에 오도록 높은 z-index 설정 권장 */
      }

      #thatzfit-iframe { 
        display: block !important; 
        width: 100% !important; 
        height: 100% !important; 
        background-color: transparent !important; 
        border-radius: 0.75rem !important; 
        will-change: visibility, width, max-width, max-height;
        border: none !important;
      }

      .thatzfit-visible { 
        visibility: visible; 
        opacity: 1; 
        animation: thatzfit-desktop-animation 0.3s ease-in-out forwards; 
        will-change: visibility, width, max-width, max-height;
      }

      @keyframes thatzfit-desktop-animation { 
        from { opacity: 0; } to { opacity: 1; } 
      }

      .thatzfit-hidden { 
        visibility: hidden;
        transition: visibility 400ms cubic-bezier(0.36, 0, 0, 1), width 400ms cubic-bezier(0.36, 0, 0, 1), max-width 400ms cubic-bezier(0.36, 0, 0, 1), max-height 400ms cubic-bezier(0.36, 0, 0, 1) !important;
        animation: thatzfit-hidden-animation 400ms cubic-bezier(0.36, 0, 0, 1) forwards !important;
      }

      .thatzfit-initialHidden { 
        visibility: hidden !important; 
      }

      @keyframes thatzfit-hidden-animation { 
        0% { opacity: 1; transform: translate3d(0, 0, 0); visibility: visible; } 
        100% { opacity: 0; transform: translate3d(0, 20px, 0); visibility: hidden; } 
      }
    `;

    doc.head.appendChild(styleElement);
  } catch (error) {
    console.error('[Thatzfit SDK] Failed to inject styles:', error);
  }
};
