import React from 'react';
import ReactDOM from 'react-dom/client';
import TestFunctionality from './test-functionality';

console.log('🚀 main-test-functionality.tsx: Starting functionality test');

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
  console.log('✅ Root element found, rendering functionality test...');

  try {
    ReactDOM.createRoot(rootElement as HTMLElement).render(
      <React.StrictMode>
        <TestFunctionality />
      </React.StrictMode>
    );
    console.log('✅ Functionality test rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render functionality test:', error);
    document.body.innerHTML = `<div style="color: red; padding: 20px;">
      ❌ Failed to render test: ${error instanceof Error ? error.message : String(error)}
    </div>`;
  }
}