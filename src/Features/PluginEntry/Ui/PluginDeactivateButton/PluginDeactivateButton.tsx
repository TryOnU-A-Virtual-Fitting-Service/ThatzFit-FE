import type { CSSProperties } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/Shared/Components';

interface PluginDeactivateButtonProps {
  className?: string;
  style?: CSSProperties;
  onClick: () => void;
}

export const PluginDeactivateButton = ({
  className,
  style,
  onClick,
}: PluginDeactivateButtonProps) => {
  return (
    <Button className={className} size='icon' style={style} onClick={onClick}>
      <X size={20} />
    </Button>
  );
};
