import { useEffect } from 'react';

import {
  FittingResultHeaderSection,
  FittingResultMainSection,
} from '@/Widgets/FittingResult';
import { FooterSection } from '@/Widgets/Plugin';

import { useFittingModelStore } from '@/Entities/FittingModel';

import { trackProductEvent } from '@/Shared/Analytics';

import { PluginLayout } from '../PluginLayout';

export const FittingResultPage = () => {
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );

  useEffect(() => {
    trackProductEvent('fitting_result_viewed', {
      default_model_id: currentFittingModel.defaultModelId,
      model_name: currentFittingModel.modelName,
    });
  }, [currentFittingModel.defaultModelId, currentFittingModel.modelName]);

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
