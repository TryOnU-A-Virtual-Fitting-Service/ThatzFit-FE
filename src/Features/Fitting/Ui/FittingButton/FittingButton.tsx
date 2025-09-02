import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { Button } from '@/Shared/Components';

export const FittingButton = () => {
  const setIsCapturing = useFittingStore((state) => state.setIsCapturing);
  const { pluginWrapper, setIsPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
    })),
  );

  const handleClickFittingButton = () => {
    setIsCapturing(true);
    setIsPluginOpen(false);

    if (!pluginWrapper) {
      return;
    }

    pluginWrapper.classList.toggle('thatzfit-visible', false);
    pluginWrapper.classList.toggle('thatzfit-hidden', true);
  };

  return (
    <Button
      className='bg-grey-02 text-body1 hover:text-grey-07 h-8 w-full cursor-pointer rounded-md text-white hover:bg-black'
      onClick={handleClickFittingButton}
    >
      입어보기
    </Button>
  );
};
