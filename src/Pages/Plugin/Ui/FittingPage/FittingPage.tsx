import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { FittingClothingCaptureScreen, FittingDialog } from '@/Widgets/Fitting';
import {
  CompanyInfoSection,
  FooterSection,
  MainSection,
} from '@/Widgets/Plugin';

import { useFittingModelStore } from '@/Entities/FittingModel';
import { userQueries } from '@/Entities/User';

import { PluginLayout } from '../PluginLayout';

export const FittingPage = () => {
  const { data: userInfo, isSuccess } = useQuery({
    ...userQueries.userInfoOptions(),
    select: (response) => response.data,
  });

  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );

  useEffect(() => {
    if (isSuccess) {
      setCurrentFittingModel({
        defaultModelUrl: userInfo.recentlyUsedModel.defaultModelUrl,
        imageName: userInfo.recentlyUsedModel.imageName,
        modelName: userInfo.recentlyUsedModel.modelName,
        defaultModelId: userInfo.recentlyUsedModel.defaultModelId,
      });
    }
  }, [isSuccess, userInfo, setCurrentFittingModel]);

  return (
    <>
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
      <FittingClothingCaptureScreen />
      <FittingDialog />
    </>
  );
};
