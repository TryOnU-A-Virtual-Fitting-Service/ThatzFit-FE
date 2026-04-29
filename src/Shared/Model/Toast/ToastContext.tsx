import { createContext } from 'react';

type ToastType = 'success' | 'error';

type ToastOptions = {
  type: ToastType;
  duration: number;
};

type ToastState = {
  isOpen: boolean;
  message: string;
  type: ToastType;
};

type ToastAction = {
  toast: {
    success: (message: string, toastOptions?: ToastOptions) => void;
    error: (message: string, toastOptions?: ToastOptions) => void;
  };
};

const ToastStateContext = createContext<ToastState>({
  isOpen: false,
  message: '',
  type: 'success',
});

const ToastActionContext = createContext<ToastAction>({
  toast: {
    success: () => {},
    error: () => {},
  },
});

export { ToastActionContext, type ToastOptions, ToastStateContext };
