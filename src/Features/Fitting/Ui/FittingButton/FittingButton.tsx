import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { useMobileTouchEnvironment } from '@/Shared/Model';

export const FittingButton = () => {
  const copy = getPluginCopy();
  const isMobileTouchEnvironment = useMobileTouchEnvironment();
  const setIsCapturing = useFittingStore((state) => state.setIsCapturing);
  const { pluginWrapper, setIsPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
    })),
  );
  const setCapturedClothingImage = useFittingStore(
    (state) => state.setCapturedClothingImage,
  );
  const setIsFittingDialogOpen = useFittingStore(
    (state) => state.setIsFittingDialogOpen,
  );
  const setProductPageUrl = useFittingStore((state) => state.setProductPageUrl);

  const initCaptureScreen = () => {
    setIsCapturing(true);
    setIsPluginOpen(false);
    setIsFittingDialogOpen(false);
    setCapturedClothingImage(null);
    setProductPageUrl(null);
  };

  const handleClickFittingButton = () => {
    if (isMobileTouchEnvironment) {
      return;
    }
    initCaptureScreen();

    if (!pluginWrapper) {
      return;
    }

    pluginWrapper.classList.toggle('thatzfit-visible', false);
    pluginWrapper.classList.toggle('thatzfit-hidden', true);
  };

  return (
    <Button
      className='bg-grey-02 text-body1 hover:text-grey-07 disabled:bg-grey-04 h-8 w-full shrink-0 cursor-pointer rounded-md text-white select-none hover:bg-black disabled:cursor-default'
      disabled={isMobileTouchEnvironment}
      onClick={handleClickFittingButton}
    >
      {isMobileTouchEnvironment
        ? copy.fitting.mobileTagGuide
        : copy.fitting.button}
    </Button>
  );
};
