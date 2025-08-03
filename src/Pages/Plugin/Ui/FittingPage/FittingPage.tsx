import {
  CompanyInfoSection,
  FooterSection,
  MainSection,
} from '@/Widgets/Plugin';

import { PluginLayout } from '../PluginLayout';

export const FittingPage = () => {
  return (
    <PluginLayout>
      <PluginLayout.Header>
        <CompanyInfoSection />
      </PluginLayout.Header>
      <PluginLayout.Main>
        <MainSection />
      </PluginLayout.Main>
      <PluginLayout.Footer>
        <FooterSection />
      </PluginLayout.Footer>
    </PluginLayout>
  );
};
