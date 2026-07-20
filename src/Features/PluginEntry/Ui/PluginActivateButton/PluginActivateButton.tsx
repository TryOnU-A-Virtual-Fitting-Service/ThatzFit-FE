import type { CSSProperties } from 'react';
import { useState } from 'react';

import { usePluginStore } from '@/Entities/Plugin';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { cn } from '@/Shared/Lib';

interface PluginActivateButtonProps {
  className?: string;
  style?: CSSProperties;
  onClick: () => void;
}

export const PluginActivateButton = ({
  className,
  style,
  onClick,
}: PluginActivateButtonProps) => {
  const copy = getPluginCopy();
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const pluginButtonImageUrl = usePluginStore(
    (state) => state.pluginButtonImageUrl,
  );
  const [isImageLoadComplete, setIsImageLoadComplete] =
    useState<boolean>(false);

  const handleImageLoad = () => {
    setIsImageLoadComplete(true);
  };

  if (!entryWrapper || !pluginButtonImageUrl) {
    return null;
  }

  return (
    <Button
      variant='ghost'
      className={cn('p-0', className, isImageLoadComplete ? 'block' : 'hidden')}
      style={{
        ...style,
        display: isImageLoadComplete ? style?.display : 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <img
        src={pluginButtonImageUrl}
        alt={copy.plugin.entryButtonAlt}
        onLoad={handleImageLoad}
        className='h-full w-full'
        style={{
          display: 'block',
          position: 'absolute',
          top: '-52%',
          left: '-52%',
          width: '204%',
          height: '204%',
          maxWidth: 'none',
          borderRadius: '16px',
          objectFit: 'fill',
        }}
      />
    </Button>
  );
};
