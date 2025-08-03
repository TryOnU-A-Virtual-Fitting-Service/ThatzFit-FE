import { Button } from '@/Shared';

interface PluginActivateButtonProps {
  className?: string;
  onClick: () => void;
}

export const PluginActivateButton = ({
  className,
  onClick,
}: PluginActivateButtonProps) => {
  return (
    <Button className={className} onClick={onClick}>
      Thatzfit
    </Button>
  );
};
