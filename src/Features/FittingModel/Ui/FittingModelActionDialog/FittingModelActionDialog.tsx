import { ChevronDown, SquarePen, SquarePlus } from 'lucide-react';

import { usePluginStore } from '@/Entities/Plugin';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

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
      <DialogTrigger asChild>
        <Button
          className={cn(
            'text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit rounded-[0.3125rem] bg-white px-[0.3125rem] py-0.5',
            dialogTriggerClassName,
          )}
        >
          <div className='flex items-center gap-1'>
            <span className='text-body3 select-none'>기본모델</span>
            <ChevronDown />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        container={iframeDocument?.body}
        showCloseButton={false}
        className='w-[12.5rem] overflow-visible p-2.5'
      >
        <div className='absolute top-[-1.875rem] right-0 flex w-full justify-end gap-2'>
          <Button
            variant='secondary'
            size='icon'
            className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit bg-white p-1'
          >
            <SquarePlus />
          </Button>
          <Button
            variant='secondary'
            size='icon'
            className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit bg-white p-1'
          >
            <SquarePen />
          </Button>
        </div>
        <div className='flex h-full w-full flex-col'>
          <DialogClose>
            <Button
              variant='ghost'
              className='text-body1 text-grey-01 hover:bg-grey-07 hover:text-grey-01 w-full bg-white'
            >
              남자 모델
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              variant='ghost'
              className='text-body1 text-grey-01 hover:bg-grey-07 hover:text-grey-01 w-full bg-white'
            >
              여자 모델
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
