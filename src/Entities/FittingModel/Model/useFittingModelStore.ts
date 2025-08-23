import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FittingModelState = {
  defaultModels: Schema.FittingModel[];
};

type FittingModelAction = {
  setDefaultModels: (defaultModels: Schema.FittingModel[]) => void;
};

type FittingModelStore = FittingModelState & FittingModelAction;

export const useFittingModelStore = create<FittingModelStore>()(
  devtools(
    (set) => ({
      defaultModels: [],
      setDefaultModels: (defaultModels) => {
        set({ defaultModels }, undefined, 'setDefaultModels');
      },
    }),
    {
      name: 'FittingModelStore',
    },
  ),
);
