import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-minimal';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { ErrorDisplay } from './components/error-boundary/ErrorDisplay';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('🚀 JSONIC Editor starting up...');
console.log('📁 React version:', React.version);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, rendering app...');
}

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🔥 React Error Boundary caught:', error, errorInfo);
      }}
      fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🔥 Application Error</h1>
          <p>The application encountered an error. Please check the console for details.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
