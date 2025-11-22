import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { TAILWIND_CSS_CDN, TAILWIND_CSS_VARIABLE } from '@/Shared/Config';

export const createPluginEntryWrapper = () => {
  const thatzfitEntryDiv =
    window.parent.document.getElementById('thatzfit-entry');

  if (!thatzfitEntryDiv) {
    return;
  }

  let shadowRoot = thatzfitEntryDiv.shadowRoot;

  if (shadowRoot && shadowRoot.firstChild) {
    usePluginEntryStore.setState({
      entryWrapper: shadowRoot.firstChild as HTMLElement,
    });
  }

  if (!shadowRoot) {
    shadowRoot = thatzfitEntryDiv.attachShadow({ mode: 'open' });
  }

  shadowRoot.innerHTML = '';

  const tailwind = document.createElement('script');
  tailwind.src = TAILWIND_CSS_CDN;
  shadowRoot.appendChild(tailwind);

  const tailwindVariable = document.createElement('style');
  tailwindVariable.textContent = TAILWIND_CSS_VARIABLE;
  if (import.meta.env.PROD) {
    shadowRoot.appendChild(tailwindVariable);
  }

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = import.meta.env.DEV
    ? './src/Apps/index.css'
    : 'https://cdn.thatzfit.com/plugin/index.Dh-C2C5M.css';
  shadowRoot.appendChild(style);

  const pluginEntry = document.createElement('div');
  pluginEntry.id = 'thatzfit-plugin-entry-wrapper';

  shadowRoot.appendChild(pluginEntry);
  usePluginEntryStore.setState({
    entryWrapper: pluginEntry,
  });
};
