import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

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
        modelUrl: userInfo.recentlyUsedModel.modelUrl,
        imageName: userInfo.recentlyUsedModel.imageName,
      });
    }
  }, [isSuccess, userInfo, setCurrentFittingModel]);

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
