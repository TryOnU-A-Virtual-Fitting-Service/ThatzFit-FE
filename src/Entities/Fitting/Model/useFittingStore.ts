import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FittingState = {
  isCapturing: boolean;
  capturedClothingImage: Blob | null;
  isFittingDialogOpen: boolean;
  isImageProcessing: boolean;
  fittingJobId: string | null;
  productPageUrl: string | null;
};

type FittingAction = {
  setIsCapturing: (isCapturing: boolean) => void;
  setCapturedClothingImage: (capturedClothingImage: Blob | null) => void;
  setIsFittingDialogOpen: (isFittingDialogOpen: boolean) => void;
  setIsImageProcessing: (isImageProcessing: boolean) => void;
  setFittingJobId: (fittingJobId: string | null) => void;
  setProductPageUrl: (productPageUrl: string | null) => void;
};

type FittingStore = FittingState & FittingAction;

export const useFittingStore = create<FittingStore>()(
  devtools((set) => ({
    isCapturing: false,
    capturedClothingImage: null,
    isFittingDialogOpen: false,
    isImageProcessing: false,
    fittingJobId: null,
    productPageUrl: null,
    setIsCapturing: (isCapturing) =>
      set({ isCapturing }, undefined, 'setIsCapturing'),
    setCapturedClothingImage: (capturedClothingImage) =>
      set({ capturedClothingImage }, undefined, 'setCapturedClothingImage'),
    setIsFittingDialogOpen: (isFittingDialogOpen) =>
      set({ isFittingDialogOpen }, undefined, 'setIsFittingDialogOpen'),
    setIsImageProcessing: (isImageProcessing) =>
      set({ isImageProcessing }, undefined, 'setIsImageProcessing'),
    setFittingJobId: (fittingJobId) =>
      set({ fittingJobId }, undefined, 'setFittingJobId'),
    setProductPageUrl: (productPageUrl) =>
      set({ productPageUrl }, undefined, 'setProductPageUrl'),
  })),
);
