import { PluginLayout } from '@/Pages/Plugin/Ui/PluginLayout';

import {
  CompanyInfoSection,
  FooterSection,
  RootErrorFallbackMainSection,
} from '@/Widgets/Plugin';

export const RootErrorFallback = () => {
  return (
    <PluginLayout>
      <PluginLayout.Header>
        <CompanyInfoSection className='pt-4' />
      </PluginLayout.Header>
      <PluginLayout.Main>
        <RootErrorFallbackMainSection />
      </PluginLayout.Main>
      <PluginLayout.Footer>
        <FooterSection />
      </PluginLayout.Footer>
    </PluginLayout>
  );
};
