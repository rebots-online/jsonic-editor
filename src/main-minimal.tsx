import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppMinimal } from './App-minimal';

console.log('🧪 Loading minimal test version...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">❌ Root element not found!</div>';
} else {
  console.log('✅ Root element found, rendering minimal app...');
  ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
      <AppMinimal />
    </React.StrictMode>
  );
}