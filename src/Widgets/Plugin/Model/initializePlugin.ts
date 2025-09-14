import { usePluginStore } from '@/Entities/Plugin';

export const initializePlugin = () => {
  const pluginWrapper = window.parent.document.getElementById(
    'thatzfit-iframe-wrapper',
  );
  const iframe = window.parent.document.getElementById(
    'thatzfit-iframe',
  ) as HTMLIFrameElement;

  if (!pluginWrapper || !iframe) {
    return;
  }

  pluginWrapper.classList.add('thatzfit-desktop', 'thatzfit-hidden');
  usePluginStore.setState({
    pluginWrapper: pluginWrapper,
    pluginIframe: iframe,
  });
};
