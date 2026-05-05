import { getPluginCopy } from '@/Shared/Config/I18n';

export const IS_VIRTUAL_FITTING_API_DISABLED = false;

export const getVirtualFittingApiDisabledMessage = () =>
  getPluginCopy().fitting.apiDisabled;
