import { usePluginStore } from '@/Entities/Plugin';

export const initializePlugin = () => {
  const pluginWrapper = window.parent.document.getElementById(
    'thatzfit-iframe-wrapper',
  );

  if (!pluginWrapper) {
    return;
  }

  pluginWrapper.classList.add('thatzfit-desktop', 'thatzfit-hidden');
  usePluginStore.setState({
    PluginWrapper: pluginWrapper,
  });
};
