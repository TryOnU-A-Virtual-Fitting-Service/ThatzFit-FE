export const initializeThatzfitStyle = () => {
  document.styleSheets[0].insertRule(
    '.thatzfit-desktop { position: fixed; bottom: 90px; right: 24px; width: 15rem; height: 570px; background-color: transparent; border-radius: 0.75rem; box-shadow: 0 0 41.711px 0 rgba(0, 0, 0, 0.15); }',
  );

  document.styleSheets[0].insertRule(
    '#thatzfit-iframe { width: 100% !important; height: 100% !important; background-color: transparent !important; border-radius: 0.75rem !important; }',
  );

  document.styleSheets[0].insertRule(
    '.thatzfit-hidden { visibility: hidden; }',
  );

  document.styleSheets[0].insertRule(
    '@keyframes thatzfit-desktop-animation { from { opacity: 0; } to { opacity: 1; } }',
  );

  document.styleSheets[0].insertRule(
    '.thatzfit-visible { visibility: visible; animation: thatzfit-desktop-animation 0.3s ease-in-out; }',
  );
};
