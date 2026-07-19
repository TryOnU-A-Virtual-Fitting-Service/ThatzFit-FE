import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { CurrentFittingModel } from './resolveCurrentFittingModel';

type FittingModelState = {
  defaultModels: Schema.FittingModel[];
  currentFittingModel: CurrentFittingModel;
  addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  };
  fittingModelActionDialog: {
    isOpen: boolean;
  };
  fittingModelUploadStatus: {
    isUploading: boolean;
  };
};

type FittingModelAction = {
  setDefaultModels: (defaultModels: Schema.FittingModel[]) => void;
  setCurrentFittingModel: (currentFittingModel: CurrentFittingModel) => void;
  setAddedFittingModel: (addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  }) => void;
  setFittingModelActionDialog: (fittingModelActionDialog: {
    isOpen: boolean;
  }) => void;
  setFittingModelUploadStatus: (fittingModelUploadStatus: {
    isUploading: boolean;
  }) => void;
};

type FittingModelStore = FittingModelState & FittingModelAction;

export const useFittingModelStore = create<FittingModelStore>()(
  devtools(
    (set) => ({
      defaultModels: [],
      currentFittingModel: {
        defaultModelUrl: '',
        imageName: '',
        modelName: '',
        defaultModelId: 0,
      },
      addedFittingModel: undefined,
      fittingModelActionDialog: {
        isOpen: false,
      },
      fittingModelUploadStatus: {
        isUploading: false,
        uploadProgress: 0,
      },
      setDefaultModels: (defaultModels) => {
        set({ defaultModels }, undefined, 'setDefaultModels');
      },
      setCurrentFittingModel: (currentFittingModel) => {
        set({ currentFittingModel }, undefined, 'setCurrentFittingModel');
      },
      setAddedFittingModel: (addedFittingModel) => {
        set({ addedFittingModel }, undefined, 'setAddedFittingModel');
      },
      setFittingModelActionDialog: (fittingModelActionDialog) => {
        set(
          { fittingModelActionDialog },
          undefined,
          'setFittingModelActionDialog',
        );
      },
      setFittingModelUploadStatus: (fittingModelUploadStatus) => {
        set(
          (state) => ({
            fittingModelUploadStatus: {
              ...state.fittingModelUploadStatus,
              ...fittingModelUploadStatus,
            },
          }),
          undefined,
          'setFittingModelUploadStatus',
        );
      },
    }),
    {
      name: 'FittingModelStore',
    },
  ),
);
