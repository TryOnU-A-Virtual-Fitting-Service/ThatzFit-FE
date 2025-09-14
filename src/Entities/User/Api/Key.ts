export const userQueryKeys = {
  all: ['user'] as const,
  userInfo: () => [...userQueryKeys.all, 'userInfo'] as const,
};
