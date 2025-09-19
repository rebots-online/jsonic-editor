import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppUltraMinimal } from './App-ultra-minimal';

console.log('🚀 main-ultra-minimal.tsx: Starting ultra-minimal test');

// Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">❌ Root element not found!</div>';
} else {
  console.log('✅ Root element found, rendering ultra-minimal app...');

  try {
    ReactDOM.createRoot(rootElement as HTMLElement).render(
      <React.StrictMode>
        <AppUltraMinimal />
      </React.StrictMode>
    );
    console.log('✅ Ultra-minimal app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render ultra-minimal app:', error);
    document.body.innerHTML = `<div style="color: red; padding: 20px;">
      ❌ Failed to render app: ${error instanceof Error ? error.message : String(error)}
    </div>`;
  }
}