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
  const {
    data: userInfo,
    isLoading,
    isSuccess,
  } = useQuery({
    ...userQueries.userInfo(),
    select: (response) => response.data,
  });

  const setDefaultModels = useFittingModelStore(
    (state) => state.setDefaultModels,
  );

  useEffect(() => {
    if (isSuccess && userInfo) {
      setDefaultModels(userInfo?.defaultModels ?? []);
    }
  }, [isSuccess, setDefaultModels, userInfo]);

  if (isLoading) {
    return null;
  }

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
