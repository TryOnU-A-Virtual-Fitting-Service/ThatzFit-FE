import { X } from 'lucide-react';

import { Button } from '@/Shared/Components';

interface PluginDeactivateButtonProps {
  className?: string;
  onClick: () => void;
}

export const PluginDeactivateButton = ({
  className,
  onClick,
}: PluginDeactivateButtonProps) => {
  return (
    <Button className={className} size='icon' onClick={onClick}>
      <X />
    </Button>
  );
};
