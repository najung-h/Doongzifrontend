import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { validateEnv } from './config/env';
import '../index.css';

// 환경변수 검증 (개발 모드에서만 경고)
if (import.meta.env.DEV) {
  validateEnv();
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);