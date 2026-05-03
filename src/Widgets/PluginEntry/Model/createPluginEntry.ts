import appStylesheetUrl from '@/Apps/index.css?url';

import {
  captureDebugInfo,
  captureDebugWarn,
} from '@/Features/Fitting/Model/debug';

import { usePluginEntryStore } from '@/Entities/PluginEntry';

const getShadowStylesheetUrl = () => {
  if (import.meta.env.DEV) {
    return appStylesheetUrl;
  }

  try {
    if (/^(https?:|blob:|data:)/.test(appStylesheetUrl)) {
      return appStylesheetUrl;
    }

    const stylesheetFileName = appStylesheetUrl.split('/').pop();
    if (!stylesheetFileName) {
      return appStylesheetUrl;
    }

    const scriptUrl = import.meta.url;
    const scriptBaseUrl = scriptUrl.slice(0, scriptUrl.lastIndexOf('/') + 1);

    return `${scriptBaseUrl}${stylesheetFileName}`;
  } catch {
    return appStylesheetUrl;
  }
};

const appendShadowStylesheet = (shadowRoot: ShadowRoot) => {
  const stylesheetUrl = getShadowStylesheetUrl();
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = stylesheetUrl;
  style.addEventListener('load', () => {
    captureDebugInfo(undefined, 'plugin_entry.stylesheet_load_success', {
      stylesheetUrl,
    });
  });
  style.addEventListener('error', () => {
    captureDebugWarn(undefined, 'plugin_entry.stylesheet_load_failed', {
      stylesheetUrl,
    });
  });

  shadowRoot.appendChild(style);
  captureDebugInfo(undefined, 'plugin_entry.stylesheet_link_appended', {
    stylesheetUrl,
  });
};

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

  appendShadowStylesheet(shadowRoot);

  const pluginEntry = document.createElement('div');
  pluginEntry.id = 'thatzfit-plugin-entry-wrapper';

  shadowRoot.appendChild(pluginEntry);
  usePluginEntryStore.setState({
    entryWrapper: pluginEntry,
  });
};
