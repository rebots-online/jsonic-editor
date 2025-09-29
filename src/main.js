import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-minimal';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
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
}
else {
    console.log('✅ Root element found, rendering app...');
}
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { onError: (error, errorInfo) => {
            console.error('🔥 React Error Boundary caught:', error, errorInfo);
        }, fallback: _jsxs("div", { style: { padding: '20px', textAlign: 'center' }, children: [_jsx("h1", { children: "\uD83D\uDD25 Application Error" }), _jsx("p", { children: "The application encountered an error. Please check the console for details." }), _jsx("button", { onClick: () => window.location.reload(), style: {
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }, children: "Reload Page" })] }), children: _jsx(App, {}) }) }));
