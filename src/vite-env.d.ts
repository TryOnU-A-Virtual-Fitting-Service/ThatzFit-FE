/// <reference types="vite/client" />

/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER: string;
  readonly VITE_PROD_SERVER: string;
  readonly VITE_CDN_HOST: string;
  readonly VITE_CAPTURE_ENGINE?: 'html2canvas' | 'display-media';
  readonly VITE_CAPTURE_FALLBACK_DISPLAY_MEDIA?: 'true' | 'false';
}
