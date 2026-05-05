import { DialogContent, DialogTitle } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { Spinner } from '@/Shared/Ui';

type FittingModelActionDialogLoadingProps = {
  iframeDocument: Document;
};

export const FittingModelActionDialogLoading = ({
  iframeDocument,
}: FittingModelActionDialogLoadingProps) => {
  const copy = getPluginCopy();

  return (
    <DialogContent
      container={iframeDocument?.body}
      showCloseButton={false}
      className='flex w-[12.5rem] items-center justify-center'
    >
      <DialogTitle className='sr-only'>{copy.model.selectTitle}</DialogTitle>
      <Spinner />
    </DialogContent>
  );
};
