import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

import './index.css';

if (import.meta.env.DEV) {
  const iframe = document.getElementById(
    'thatzfit-iframe',
  ) as HTMLIFrameElement;
  const iframeDocument =
    iframe.contentWindow?.document || iframe.contentDocument;
  if (iframe && iframeDocument) {
    createRoot(iframeDocument.getElementById('thatzfit-root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
} else {
  createRoot(document.getElementById('thatzfit-root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
