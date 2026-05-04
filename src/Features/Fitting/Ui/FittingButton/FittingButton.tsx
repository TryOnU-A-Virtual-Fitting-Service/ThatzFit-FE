import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { Button } from '@/Shared/Components';
import { useToast } from '@/Shared/Model';

import { VIRTUAL_FITTING_READINESS_FALLBACK_MESSAGE } from '../../Config';
import { useVirtualFittingReadiness } from '../../Model';
import { captureDebugError, captureDebugInfo } from '../../Model/debug';

export const FittingButton = () => {
  const { toast } = useToast();
  const {
    mutateAsync: checkVirtualFittingReadiness,
    isPending: isReadinessPending,
  } = useVirtualFittingReadiness();
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

  const initCaptureScreen = () => {
    setIsCapturing(true);
    setIsPluginOpen(false);
    setIsFittingDialogOpen(false);
    setCapturedClothingImage(null);
  };

  const handleClickFittingButton = async () => {
    try {
      const { data: readiness } = await checkVirtualFittingReadiness(undefined);
      captureDebugInfo(undefined, 'capture.readiness_check_success', {
        ready: readiness.ready,
        paused: readiness.paused,
        provider: readiness.provider,
        reason: readiness.reason,
      });

      if (!readiness.ready) {
        toast.error(readiness.message);
        return;
      }
    } catch (error) {
      captureDebugError(undefined, 'capture.readiness_check_failed', { error });
      toast.error(VIRTUAL_FITTING_READINESS_FALLBACK_MESSAGE);
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
      className='bg-grey-02 text-body1 hover:text-grey-07 h-8 w-full cursor-pointer rounded-md text-white select-none hover:bg-black'
      onClick={handleClickFittingButton}
      disabled={isReadinessPending}
    >
      {isReadinessPending ? '확인 중' : '입어보기'}
    </Button>
  );
};
