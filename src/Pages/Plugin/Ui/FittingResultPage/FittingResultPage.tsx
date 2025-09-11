import {
  FittingResultHeaderSection,
  FittingResultMainSection,
} from '@/Widgets/FittingResult';
import { FooterSection } from '@/Widgets/Plugin';

import { PluginLayout } from '../PluginLayout';

export const FittingResultPage = () => {
  return (
    <PluginLayout>
      <PluginLayout.Header>
        <FittingResultHeaderSection />
      </PluginLayout.Header>
      <PluginLayout.Main>
        <FittingResultMainSection />
      </PluginLayout.Main>
      <PluginLayout.Footer>
        <FooterSection />
      </PluginLayout.Footer>
    </PluginLayout>
  );
};
