import { Maximize2, Minimize2 } from 'lucide-react';

import { usePluginEntryStore } from '@/Entities/PluginEntry';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

type ModelZoomDialogProps = {
  dialogTriggerClassName?: string;
};

export const ModelZoomDialog = ({
  dialogTriggerClassName,
}: ModelZoomDialogProps) => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='icon'
          className={cn(
            'text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-5 w-5 rounded-[0.3125rem] bg-white p-1',
            dialogTriggerClassName,
          )}
        >
          <Maximize2 className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='z-[10000000]'
        overlayClassName='z-[10000000]'
        showCloseButton={false}
        container={entryWrapper}
      >
        <DialogHeader>
          <DialogTitle>Model Zoom</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              size='icon'
              className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-5 w-5 rounded-[0.3125rem] bg-white p-1'
            >
              <Minimize2 className='size-4' />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
