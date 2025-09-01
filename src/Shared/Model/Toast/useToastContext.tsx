import { useContext } from 'react';

import { ToastActionContext, ToastStateContext } from './ToastContext';

const useToastState = () => {
  const toastState = useContext(ToastStateContext);
  if (!toastState) {
    throw new Error('useToastState must be used within a ToastProvider');
  }
  return toastState;
};

const useToastAction = () => {
  const toastAction = useContext(ToastActionContext);
  if (!toastAction) {
    throw new Error('useToastAction must be used within a ToastProvider');
  }
  return toastAction;
};

const useToast = () => {
  return { ...useToastAction(), ...useToastState() };
};

export { useToast };
