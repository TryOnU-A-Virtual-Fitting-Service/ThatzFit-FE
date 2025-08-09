import { useRef, useState } from 'react';
import { Info, X } from 'lucide-react';

import { usePluginStore } from '@/Entities/Plugin';

import {
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/Shared/Components/Ui';

export const FittingHistoryInfoTooltip = () => {
  const pluginIframe = usePluginStore((state) => state.pluginIframe);
  const iframeDocument = pluginIframe?.contentDocument;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeTimerRef = useRef<number | null>(null);

  const openTooltip = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) return;
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 100);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <span onPointerEnter={openTooltip} onPointerLeave={scheduleClose}>
          <Info className='text-grey-07 size-3.5' />
        </span>
      </TooltipTrigger>
      <TooltipContent
        container={iframeDocument?.body}
        onPointerEnter={openTooltip}
        onPointerLeave={scheduleClose}
        className='bg-light-blue fill-light-blue'
      >
        <span className='text-body2-medium text-grey-03'>
          최대 20개까지 저장됩니다
        </span>
        <button className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
          <X />
        </button>
      </TooltipContent>
    </Tooltip>
  );
};
