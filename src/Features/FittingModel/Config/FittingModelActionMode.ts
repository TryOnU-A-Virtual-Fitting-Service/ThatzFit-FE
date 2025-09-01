export const FITTING_MODEL_ACTION_MODE = {
  SELECT: 'SELECT',
  ADD: 'ADD',
  EDIT: 'EDIT',
} as const;

export type FittingModelActionMode = keyof typeof FITTING_MODEL_ACTION_MODE;
