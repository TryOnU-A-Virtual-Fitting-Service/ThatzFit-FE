export const pluginKeys = {
  all: ['plugin'] as const,
  setup: () => [...pluginKeys.all, 'setup'] as const,
};
