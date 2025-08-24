import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FittingModelState = {
  defaultModels: Schema.FittingModel[];
  currentFittingModel: {
    modelUrl: string;
    imageName: string;
  };
  addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  };
};

type FittingModelAction = {
  setDefaultModels: (defaultModels: Schema.FittingModel[]) => void;
  setCurrentFittingModel: (currentFittingModel: {
    modelUrl: string;
    imageName: string;
  }) => void;
  setAddedFittingModel: (addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  }) => void;
};

type FittingModelStore = FittingModelState & FittingModelAction;

export const useFittingModelStore = create<FittingModelStore>()(
  devtools(
    (set) => ({
      defaultModels: [],
      currentFittingModel: {
        modelUrl: '',
        imageName: '',
      },
      addedFittingModel: undefined,
      setDefaultModels: (defaultModels) => {
        set({ defaultModels }, undefined, 'setDefaultModels');
      },
      setCurrentFittingModel: (currentFittingModel) => {
        set({ currentFittingModel }, undefined, 'setCurrentFittingModel');
      },
      setAddedFittingModel: (addedFittingModel) => {
        set({ addedFittingModel }, undefined, 'setAddedFittingModel');
      },
    }),
    {
      name: 'FittingModelStore',
    },
  ),
);
