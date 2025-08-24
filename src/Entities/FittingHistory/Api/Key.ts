export const fittingHistoryKeys = {
  all: ['fittingHistory'] as const,
  list: () => [...fittingHistoryKeys.all, 'list'] as const,
};
