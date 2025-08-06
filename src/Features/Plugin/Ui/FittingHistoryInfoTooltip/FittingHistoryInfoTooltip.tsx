import { type MouseEvent, useState } from 'react';
import { Info } from 'lucide-react';

import { usePluginStore } from '@/Entities/Plugin';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/Shared/Components/Ui';

export const FittingHistoryInfoTooltip = () => {
  const pluginIframe = usePluginStore((state) => state.pluginIframe);
  const iframeDocument = pluginIframe?.contentDocument;
  const rootDiv = iframeDocument?.body;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <Tooltip open={isOpen} delayDuration={0}>
      <TooltipTrigger asChild>
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Info className='text-grey-07 size-3.5' />
        </span>
      </TooltipTrigger>
      <TooltipContent
        container={rootDiv}
        className='bg-light-blue fill-light-blue'
      >
        <span className='text-body2-medium text-grey-03'>
          최대 20개까지 저장됩니다
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
