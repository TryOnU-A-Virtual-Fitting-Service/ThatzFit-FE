import { DialogTrigger } from '@radix-ui/react-dialog';
import { Maximize2 } from 'lucide-react';

import { Button } from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

type ModelZoomDialogTriggerProps = {
  dialogTriggerClassName?: string;
};

export const ModelZoomDialogTrigger = ({
  dialogTriggerClassName,
}: ModelZoomDialogTriggerProps) => {
  return (
    <DialogTrigger asChild>
      <Button
        size='icon'
        className={cn(
          'text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-5 w-5 cursor-pointer rounded-[0.3125rem] bg-white p-1',
          dialogTriggerClassName,
        )}
      >
        <Maximize2 className='size-4' />
      </Button>
    </DialogTrigger>
  );
};
