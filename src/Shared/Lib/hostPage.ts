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
