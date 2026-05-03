import { useEffect, useState } from 'react';

import { initializePlugin } from '@/Widgets/Plugin';
import { createPluginEntry } from '@/Widgets/PluginEntry';

import { PluginEntryButton } from '@/Features/PluginEntry';

import { initialCompanyInfo } from '@/Entities/Plugin';

import { Toast, ToastProvider } from '@/Shared/Ui';

import { PluginRouter } from './Ui/PluginRouter';
import { TanstackQueryProvider } from './Ui/TanstackQueryProvider';
import { initializeThatzfitStyle, initUserInfo } from './Model';

export const App = () => {
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      initializeThatzfitStyle();
      createPluginEntry();
      initializePlugin();

      try {
        await initUserInfo();
        await initialCompanyInfo();
        if (isMounted) {
          setIsUserInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize user info', error);
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <TanstackQueryProvider>
      <ToastProvider>
        {isUserInitialized ? <PluginRouter /> : null}
        {isUserInitialized ? <PluginEntryButton /> : null}
        <Toast />
      </ToastProvider>
    </TanstackQueryProvider>
  );
};
