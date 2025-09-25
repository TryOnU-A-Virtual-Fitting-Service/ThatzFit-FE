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

  const tailwindVariable = document.createElement('style');
  tailwindVariable.textContent = `
  :host {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-translate-z: 0;
  --tw-rotate-x: rotateX(0);
  --tw-rotate-y: rotateY(0);
  --tw-rotate-z: rotateZ(0);
  --tw-skew-x: skewX(0);
  --tw-skew-y: skewY(0);
  --tw-border-style: solid;
  --tw-gradient-from: #0000;
  --tw-gradient-via: #0000;
  --tw-gradient-to: #0000;
  --tw-gradient-from-position: 0%;
  --tw-gradient-via-position: 50%;
  --tw-gradient-to-position: 100%;
  --tw-shadow: 0 0 #0000;
  --tw-inset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-inset-ring-shadow: 0 0 #0000;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-outline-style: solid;
}`;

  if (import.meta.env.PROD) {
    shadowRoot.appendChild(tailwindVariable);
  }

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = import.meta.env.DEV
    ? './src/Apps/index.css'
    : 'https://cdn.thatzfit.com/plugin/index.Bi_tNvAp.css';
  shadowRoot.appendChild(style);

  const pluginEntry = document.createElement('div');
  pluginEntry.id = 'thatzfit-plugin-entry-wrapper';

  shadowRoot.appendChild(pluginEntry);
  usePluginEntryStore.setState({
    entryWrapper: pluginEntry,
  });
};
