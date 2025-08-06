import { Info } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/Shared/Components/Ui';

export const FittingHistoryInfoTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className='text-grey-07 size-3' />
      </TooltipTrigger>
      <TooltipContent>
        <span className='text-body2-medium text-grey-03'>
          최대 20개까지 저장됩니다
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
