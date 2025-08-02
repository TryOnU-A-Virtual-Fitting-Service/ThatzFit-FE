import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

import './index.css';

if (import.meta.env.DEV) {
  const iframe = document.getElementById('thatzfit-iframe') as HTMLIFrameElement;
  if (iframe) {
    createRoot(iframe.contentWindow!.document.getElementById('thatzfit-root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

if (import.meta.env.PROD) {
  createRoot(document.getElementById('thatzfit-root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
}

