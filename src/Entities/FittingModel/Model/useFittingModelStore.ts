import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FittingModelState = {
  defaultModels: Schema.FittingModel[];
  currentFittingModel: {
    modelUrl: string;
    imageName: string;
    modelName: Schema.FittingModel['modelName'];
  };
  addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  };
  fittingModelActionDialog: {
    isOpen: boolean;
  };
  fittingModelUploadStatus: {
    isUploading: boolean;
    uploadProgress: number;
  };
};

type FittingModelAction = {
  setDefaultModels: (defaultModels: Schema.FittingModel[]) => void;
  setCurrentFittingModel: (currentFittingModel: {
    modelUrl: string;
    imageName: string;
    modelName: Schema.FittingModel['modelName'];
  }) => void;
  setAddedFittingModel: (addedFittingModel?: {
    modelImageFile: File;
    modelImageUrl: string;
  }) => void;
  setFittingModelActionDialog: (fittingModelActionDialog: {
    isOpen: boolean;
  }) => void;
  setFittingModelUploadStatus: (fittingModelUploadStatus: {
    isUploading: boolean;
    uploadProgress: number;
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
        modelName: '',
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
