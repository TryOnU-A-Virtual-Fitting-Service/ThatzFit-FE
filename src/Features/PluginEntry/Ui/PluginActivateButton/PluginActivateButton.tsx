import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Button } from '@/Shared';

interface PluginActivateButtonProps {
  className?: string;
  onClick: () => void;
}

export const PluginActivateButton = ({
  className,
  onClick,
}: PluginActivateButtonProps) => {
  const EntryWrapper = usePluginEntryStore((state) => state.EntryWrapper);

  if (!EntryWrapper) {
    return null;
  }

  return (
    <Button className={className} onClick={onClick}>
      Thatzfit
    </Button>
  );
};
