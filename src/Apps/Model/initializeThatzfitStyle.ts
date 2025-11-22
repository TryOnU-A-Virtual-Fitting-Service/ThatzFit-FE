export const initializeThatzfitStyle = () => {
  window.parent.document.styleSheets[0].insertRule(
    `.thatzfit-desktop { 
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 15rem;
        height: 570px;
        background-color: transparent;
        border-radius: 0.75rem;
        box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15)
        will-change: visibility, width, max-width, max-height;
      }`,
  );

  window.parent.document.styleSheets[0].insertRule(
    `#thatzfit-iframe { 
    display: block !important; 
    width: 100% !important; 
    height: 100% !important; 
    background-color: transparent !important; 
    border-radius: 0.75rem !important; 
    will-change: visibility, width, max-width, max-height;
    }`,
  );

  window.parent.document.styleSheets[0].insertRule(
    `.thatzfit-visible { 
        visibility: visible; 
        opacity: 1; 
        animation: thatzfit-desktop-animation 0.3s ease-in-out forwards; 
        will-change: visibility, width, max-width, max-height;
      }`,
  );

  window.parent.document.styleSheets[0].insertRule(
    `@keyframes thatzfit-desktop-animation { 
        from { opacity: 0; } to { opacity: 1; } 
        will-change: visibility, width, max-width, max-height;
      }`,
  );

  window.parent.document.styleSheets[0].insertRule(
    `.thatzfit-hidden { 
    visibility: hidden;
    transition: visibility 400ms cubic-bezier(0.36, 0, 0, 1), width 400ms cubic-bezier(0.36, 0, 0, 1), max-width 400ms cubic-bezier(0.36, 0, 0, 1), max-height 400ms cubic-bezier(0.36, 0, 0, 1) !important;
    animation: 400ms cubic-bezier(0.36, 0, 0, 1) 0s 1 normal none running thatzfit-hidden-animation !important 
    }`,
  );

  window.parent.document.styleSheets[0].insertRule(
    '.thatzfit-initialHidden { visibility: hidden; !important }',
  );

  window.parent.document.styleSheets[0].insertRule(
    '@keyframes thatzfit-hidden-animation { from { opacity: 1; visibility: visible; } to { opacity: 0; visibility: hidden; } }',
  );

  window.parent.document.styleSheets[0].insertRule(
    `@keyframes thatzfit-hidden-animation { 0% { opacity:1; transform : translate3d(0, 0, 0); } 100% { opacity:0; transform : translate3d(0, 20px, 0); } }`,
  );
};
