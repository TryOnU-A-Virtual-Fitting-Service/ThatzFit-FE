export const FITTING_MODEL_UPDATE_STATUS = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type FittingModelUpdateStatus =
  (typeof FITTING_MODEL_UPDATE_STATUS)[keyof typeof FITTING_MODEL_UPDATE_STATUS];
