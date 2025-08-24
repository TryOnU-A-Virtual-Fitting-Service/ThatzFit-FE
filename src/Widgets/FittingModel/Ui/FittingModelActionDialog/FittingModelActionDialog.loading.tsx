import { DialogContent, DialogTitle } from '@/Shared/Components';
import { Spinner } from '@/Shared/Ui';

type FittingModelActionDialogLoadingProps = {
  iframeDocument: Document;
};

export const FittingModelActionDialogLoading = ({
  iframeDocument,
}: FittingModelActionDialogLoadingProps) => {
  return (
    <DialogContent
      container={iframeDocument?.body}
      showCloseButton={false}
      className='flex w-[12.5rem] items-center justify-center'
    >
      <DialogTitle className='sr-only'>모델 선택</DialogTitle>
      <Spinner />
    </DialogContent>
  );
};
