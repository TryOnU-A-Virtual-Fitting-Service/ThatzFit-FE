import { usePluginEntryStore } from '@/Entities/PluginEntry';

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
  tailwind.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
  shadowRoot.appendChild(tailwind);

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = './src/Apps/index.css';
  shadowRoot.appendChild(style);

  const pluginEntry = document.createElement('div');
  pluginEntry.id = 'thatzfit-plugin-entry-wrapper';

  shadowRoot.appendChild(pluginEntry);
  usePluginEntryStore.setState({
    entryWrapper: pluginEntry,
  });
};
