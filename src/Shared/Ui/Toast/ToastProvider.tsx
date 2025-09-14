import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ToastActionContext,
  type ToastOptions,
  ToastStateContext,
} from '../../Model';

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastOptions['type']>('success');
  const timeoutRef = useRef<number | null>(null);

  const toastState = useMemo(
    () => ({
      isOpen,
      message,
      type,
    }),
    [isOpen, message, type],
  );

  const closeToast = useCallback((duration?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, duration ?? 2000);
  }, []);

  const toast = useMemo(() => {
    return {
      success: (message: string, toastOptions?: ToastOptions) => {
        setIsOpen(true);
        setMessage(message);
        setType('success');
        closeToast(toastOptions?.duration);
      },
      error: (message: string, toastOptions?: ToastOptions) => {
        setIsOpen(true);
        setMessage(message);
        setType('error');
        closeToast(toastOptions?.duration);
      },
    };
  }, [closeToast]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ToastStateContext.Provider value={toastState}>
      <ToastActionContext.Provider value={{ toast }}>
        {children}
      </ToastActionContext.Provider>
    </ToastStateContext.Provider>
  );
};
