import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Button } from '@/Shared/Components';

interface PluginActivateButtonProps {
  className?: string;
  onClick: () => void;
}

export const PluginActivateButton = ({
  className,
  onClick,
}: PluginActivateButtonProps) => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);

  if (!entryWrapper) {
    return null;
  }

  return (
    <Button className={className} onClick={onClick}>
      Thatzfit
    </Button>
  );
};
