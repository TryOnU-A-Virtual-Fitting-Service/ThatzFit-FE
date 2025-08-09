import { useRef, useState } from 'react';
import { Info, X } from 'lucide-react';

import { usePluginStore } from '@/Entities/Plugin';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/Shared/Components/Ui';

export const FittingHistoryInfoTooltip = () => {
  const pluginIframe = usePluginStore((state) => state.pluginIframe);
  const iframeDocument = pluginIframe?.contentDocument;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeTimerRef = useRef<number | null>(null);

  const handlePointerOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handlePointerLeave = () => {
    if (closeTimerRef.current) return;
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 100);
  };

  const handleClickCloseButton = () => {
    setIsOpen(false);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <span
          onPointerEnter={handlePointerOpen}
          onPointerLeave={handlePointerLeave}
          className='text-grey-07 hover:text-grey-05'
        >
          <Info className='size-3.5' />
        </span>
      </TooltipTrigger>
      <TooltipContent
        container={iframeDocument?.body}
        onPointerEnter={handlePointerOpen}
        onPointerLeave={handlePointerLeave}
        className='bg-light-blue fill-light-blue'
      >
        <div className='flex items-center gap-1'>
          <span className='text-body2-medium text-grey-03'>
            최대 20개까지 저장됩니다
          </span>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleClickCloseButton}
            className='text-grey-03 hover:text-grey-04 h-4 w-4 cursor-pointer hover:bg-transparent'
          >
            <X />
          </Button>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
