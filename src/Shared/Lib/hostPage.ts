const THATZFIT_DEMO_HOSTNAME = 'demo.thatzfit.me';

export const getHostPageUrl = () => {
  try {
    if (window.parent && window.parent !== window) {
      return window.parent.location.href;
    }
  } catch {
    if (document.referrer) {
      return document.referrer;
    }
  }

  return window.location.href;
};

export const isThatzFitDemoPage = (hostPageUrl = getHostPageUrl()) => {
  try {
    return (
      new URL(hostPageUrl).hostname.toLowerCase() === THATZFIT_DEMO_HOSTNAME
    );
  } catch {
    return false;
  }
};
