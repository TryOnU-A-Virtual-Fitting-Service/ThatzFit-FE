import { usePluginEntryStore } from '@/Entities/PluginEntry';

export const createPluginEntryWrapper = () => {
  const thatzfitEnrtyDiv =
    window.parent.document.getElementById('thatzfit-entry');

  if (!thatzfitEnrtyDiv) {
    return;
  }

  let shadowRoot = thatzfitEnrtyDiv.shadowRoot;

  if (shadowRoot && shadowRoot.firstChild) {
    usePluginEntryStore.setState({
      EntryWrapper: shadowRoot.firstChild as HTMLElement,
    });
  }

  if (!shadowRoot) {
    shadowRoot = thatzfitEnrtyDiv.attachShadow({ mode: 'open' });
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
    EntryWrapper: pluginEntry,
  });
};
