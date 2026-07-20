import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { FittingClothingCaptureScreen, FittingDialog } from '@/Widgets/Fitting';
import {
  CompanyInfoSection,
  FooterSection,
  MainSection,
} from '@/Widgets/Plugin';

import { MobileProductTryOnBridge } from '@/Features/Fitting';

import {
  fittingModelQueries,
  resolveCurrentFittingModel,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { PluginLayout } from '../PluginLayout';

export const FittingPage = () => {
  const { data: fittingModelList, isSuccess: isFittingModelListSuccess } =
    useSuspenseQuery({
      ...fittingModelQueries.listOptions(),
      select: (response) => response.data,
    });

  const { currentFittingModel, setCurrentFittingModel } = useFittingModelStore(
    useShallow((state) => ({
      currentFittingModel: state.currentFittingModel,
      setCurrentFittingModel: state.setCurrentFittingModel,
    })),
  );

  useEffect(() => {
    if (isFittingModelListSuccess) {
      const nextFittingModel = resolveCurrentFittingModel({
        currentFittingModel,
        fittingModelList,
      });

      if (nextFittingModel !== currentFittingModel) {
        setCurrentFittingModel(nextFittingModel);
      }
    }
  }, [
    currentFittingModel,
    setCurrentFittingModel,
    fittingModelList,
    isFittingModelListSuccess,
  ]);

  return (
    <>
      <PluginLayout>
        <PluginLayout.Header>
          <CompanyInfoSection className='pt-4' />
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
      <MobileProductTryOnBridge />
    </>
  );
};
