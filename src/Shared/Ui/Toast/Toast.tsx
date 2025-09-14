import clsx from 'clsx';
import { Check, CircleAlert } from 'lucide-react';

import { useToast } from '@/Shared/Model';

export const Toast = () => {
  const { isOpen, message, type } = useToast();

  if (type === 'success') {
    return (
      <div
        className={clsx(
          'text-body3-regular bg-grey-02 animate-toast fixed top-16 left-1/2 z-[10000000] flex w-fit translate-x-[-50%] items-center gap-0.5 rounded-lg px-2 py-0.5 text-white transition-all duration-300',
          isOpen
            ? 'animate-toast opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <Check size={14} />
        <span className='text-nowrap'>{message}</span>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div
        className={clsx(
          'text-body3-regular bg-red animate-toast fixed top-16 left-1/2 z-[10000000] flex w-fit translate-x-[-50%] items-center gap-0.5 rounded-lg px-2 py-0.5 text-white transition-all duration-300',
          isOpen
            ? 'animate-toast opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <CircleAlert size={14} />
        <span className='text-nowrap'>{message}</span>
      </div>
    );
  }

  return null;
};
