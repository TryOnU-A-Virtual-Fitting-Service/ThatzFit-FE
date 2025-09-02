import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FittingState = {
  isCapturing: boolean;
  capturedClothingImage: Blob | null;
  isFittingDialogOpen: boolean;
};

type FittingAction = {
  setIsCapturing: (isCapturing: boolean) => void;
  setCapturedClothingImage: (capturedClothingImage: Blob) => void;
  setIsFittingDialogOpen: (isFittingDialogOpen: boolean) => void;
};

type FittingStore = FittingState & FittingAction;

export const useFittingStore = create<FittingStore>()(
  devtools((set) => ({
    isCapturing: false,
    capturedClothingImage: null,
    isFittingDialogOpen: false,
    setIsCapturing: (isCapturing) =>
      set({ isCapturing }, undefined, 'setIsCapturing'),
    setCapturedClothingImage: (capturedClothingImage) =>
      set({ capturedClothingImage }, undefined, 'setCapturedClothingImage'),
    setIsFittingDialogOpen: (isFittingDialogOpen) =>
      set({ isFittingDialogOpen }, undefined, 'setIsFittingDialogOpen'),
  })),
);
