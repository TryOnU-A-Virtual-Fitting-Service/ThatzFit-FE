import { useEffect, useState } from 'react';

import { initializePlugin } from '@/Widgets/Plugin';
import { createPluginEntry } from '@/Widgets/PluginEntry';

import { PluginEntryButton } from '@/Features/PluginEntry';

import { initialCompanyInfo } from '@/Entities/Plugin';
import { getUserToken } from '@/Entities/User';

import {
  identifyMixpanelUser,
  initializeMixpanel,
  trackProductEvent,
} from '@/Shared/Analytics';
import { initializeI18n } from '@/Shared/Config';
import { getHostPageUrl } from '@/Shared/Lib';
import { Toast, ToastProvider } from '@/Shared/Ui';

import { PluginRouter } from './Ui/PluginRouter';
import { TanstackQueryProvider } from './Ui/TanstackQueryProvider';
import { initializeThatzfitStyle, initUserInfo } from './Model';

export const App = () => {
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      initializeI18n();
      initializeThatzfitStyle();
      initializeMixpanel();
      createPluginEntry();
      initializePlugin();

      try {
        await initialCompanyInfo();
        await initUserInfo();
        identifyMixpanelUser(getUserToken());
        trackProductEvent('plugin_loaded', {
          host_page_url: getHostPageUrl(),
        });
        if (isMounted) {
          setIsUserInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize ThatzFit plugin', error);
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
