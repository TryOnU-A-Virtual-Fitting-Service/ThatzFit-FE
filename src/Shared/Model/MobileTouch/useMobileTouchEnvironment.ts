import { useSyncExternalStore } from 'react';

const MOBILE_TOUCH_MEDIA_QUERY = '(hover: none) and (pointer: coarse)';

const getHostWindow = () => {
  try {
    if (window.parent?.document?.body) {
      return window.parent;
    }
  } catch {
    // The plugin normally runs same-origin. Fall back defensively.
  }
  return window;
};

const subscribe = (onStoreChange: () => void) => {
  const mediaQuery = getHostWindow().matchMedia(MOBILE_TOUCH_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
};

const getSnapshot = () => {
  const hostWindow = getHostWindow();
  return (
    hostWindow.navigator.maxTouchPoints > 0 &&
    hostWindow.matchMedia(MOBILE_TOUCH_MEDIA_QUERY).matches
  );
};

export const useMobileTouchEnvironment = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
