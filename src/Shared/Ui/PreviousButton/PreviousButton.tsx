import type { ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/Shared/Components';
import { cn } from '@/Shared/Lib';

type PreviousButtonProps = {
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
  className?: string;
};

export const PreviousButton = ({
  variant,
  size,
  className,
}: PreviousButtonProps) => {
  const navigate = useNavigate();

  const handleClickPreviousButton = () => {
    navigate('..');
  };

  return (
    <Button
      variant={variant ?? 'ghost'}
      size={size ?? 'icon'}
      onClick={handleClickPreviousButton}
      className={cn('cursor-pointer', className)}
    >
      <ChevronLeft />
    </Button>
  );
};
