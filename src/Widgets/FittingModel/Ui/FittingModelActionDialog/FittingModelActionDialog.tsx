import { Suspense } from 'react';

import { usePluginStore } from '@/Entities/Plugin';

import { Dialog } from '@/Shared/Components';

import { FittingModelActionDialogContent } from './FittingModelActionDialog.content';
import { FittingModelActionDialogLoading } from './FittingModelActionDialog.loading';
import { FittingModelActionDialogTrigger } from './FittingModelActionDialog.trigger';

type FittingModelActionDialogProps = {
  dialogTriggerClassName?: string;
};

export const FittingModelActionDialog = ({
  dialogTriggerClassName,
}: FittingModelActionDialogProps) => {
  const iframe = usePluginStore((state) => state.pluginIframe);

  const iframeDocument =
    iframe?.contentWindow?.document || iframe?.contentDocument;

  if (!iframeDocument) {
    return null;
  }

  return (
    <Dialog>
      <FittingModelActionDialogTrigger
        dialogTriggerClassName={dialogTriggerClassName}
      />
      <Suspense
        fallback={
          <FittingModelActionDialogLoading iframeDocument={iframeDocument} />
        }
      >
        <FittingModelActionDialogContent iframeDocument={iframeDocument} />
      </Suspense>
    </Dialog>
  );
};
