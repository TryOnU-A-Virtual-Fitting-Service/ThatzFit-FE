export const fittingModelKeys = {
  all: ['fittingModel'] as const,
  list: () => [...fittingModelKeys.all, 'list'] as const,
};
