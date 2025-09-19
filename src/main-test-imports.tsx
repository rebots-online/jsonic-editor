import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTestImports from './App-test-imports';

console.log('🚀 main-test-imports.tsx: Starting import test version');

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
  console.log('✅ Root element found, rendering import test app...');

  try {
    ReactDOM.createRoot(rootElement as HTMLElement).render(
      <React.StrictMode>
        <AppTestImports />
      </React.StrictMode>
    );
    console.log('✅ Import test app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render import test app:', error);
    document.body.innerHTML = `<div style="color: red; padding: 20px;">
      ❌ Failed to render app: ${error instanceof Error ? error.message : String(error)}
    </div>`;
  }
}