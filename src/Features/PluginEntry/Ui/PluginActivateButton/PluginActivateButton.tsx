import { useState } from 'react';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Button } from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

interface PluginActivateButtonProps {
  className?: string;
  onClick: () => void;
}

export const PluginActivateButton = ({
  className,
  onClick,
}: PluginActivateButtonProps) => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const pluginButtonImageUrl = usePluginStore(
    (state) => state.pluginButtonImageUrl,
  );
  const [isImageLoadComplete, setIsImageLoadComplete] =
    useState<boolean>(false);

  const handleImageLoad = () => {
    setIsImageLoadComplete(true);
  };

  if (!entryWrapper) {
    return null;
  }

  return (
    <Button
      variant='ghost'
      className={cn('p-0', className, isImageLoadComplete ? 'block' : 'hidden')}
      onClick={onClick}
    >
      <img
        src={pluginButtonImageUrl}
        alt='플러그인 진입 버튼 로고'
        onLoad={handleImageLoad}
        className='object-fit h-full w-full rounded-lg'
      />
    </Button>
  );
};
