import { Dialog } from '@/Shared/Components';

import { ModelZoomDialogContent } from './ModelZoomDialog.content';
import { ModelZoomDialogTrigger } from './ModelZoomDialog.trigger';

type ModelZoomDialogProps = {
  dialogTriggerClassName?: string;
};

export const ModelZoomDialog = ({
  dialogTriggerClassName,
}: ModelZoomDialogProps) => {
  return (
    <Dialog>
      <ModelZoomDialogTrigger dialogTriggerClassName={dialogTriggerClassName} />
      <ModelZoomDialogContent />
    </Dialog>
  );
};
