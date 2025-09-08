import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';
import { useToast } from '@/Shared/Model';

import { usePostFittingJob } from '../../Model';

const FITTING_FAILED_MESSAGE = '피팅에 실패했어요.';

export const FittingExecutionButton = () => {
  const { mutateAsync: postFittingJob } = usePostFittingJob();

  const { capturedClothingImage, setIsFittingDialogOpen, setFittingJobId } =
    useFittingStore(
      useShallow((state) => ({
        capturedClothingImage: state.capturedClothingImage,
        setCapturedClothingImage: state.setCapturedClothingImage,
        setIsFittingDialogOpen: state.setIsFittingDialogOpen,
        setFittingJobId: state.setFittingJobId,
      })),
    );

  const { toast } = useToast();

  if (!capturedClothingImage) {
    return null;
  }

  const handleClickExecutionButton = () => {
    postFittingJob(undefined, {
      onSuccess: ({ data: { tryOnJobId } }) => {
        setFittingJobId(tryOnJobId);
      },
      onError: () => {
        toast.error(FITTING_FAILED_MESSAGE);
      },
      onSettled: () => {
        setIsFittingDialogOpen(false);
      },
    });
  };

  return (
    <Button
      size='lg'
      className='!grow cursor-pointer'
      onClick={handleClickExecutionButton}
    >
      확인
    </Button>
  );
};
