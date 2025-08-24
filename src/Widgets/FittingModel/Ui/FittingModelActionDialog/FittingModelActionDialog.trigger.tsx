import { ChevronDown } from 'lucide-react';

import { Button, DialogTrigger } from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

type FittingModelActionDialogTriggerProps = {
  dialogTriggerClassName?: string;
};

export const FittingModelActionDialogTrigger = ({
  dialogTriggerClassName,
}: FittingModelActionDialogTriggerProps) => {
  return (
    <DialogTrigger asChild>
      <Button
        className={cn(
          'text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit cursor-pointer rounded-[0.3125rem] bg-white px-[0.3125rem] py-0.5',
          dialogTriggerClassName,
        )}
      >
        <div className='flex items-center gap-1'>
          <span className='text-body3 select-none'>기본모델</span>
          <ChevronDown />
        </div>
      </Button>
    </DialogTrigger>
  );
};
