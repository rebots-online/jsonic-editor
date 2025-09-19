import React from 'react';

interface ErrorDisplayProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset?: () => void;
  showDetails?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
  onReset,
  showDetails = false
}) => {
  if (!error) return null;

  return (
    <div className="error-display" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      color: '#c92a2a',
      fontFamily: 'monospace'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '16px' }}>
        🔴 Application Error
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <strong>Error:</strong> {error.message}
      </div>

      {showDetails && errorInfo && (
        <details style={{ marginBottom: '16px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
            Component Stack Trace
          </summary>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #dee2e6'
          }}>
            {errorInfo.componentStack}
          </pre>
        </details>
      )}

      {showDetails && error.stack && (
        <details style={{ marginBottom: '16px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
            Full Stack Trace
          </summary>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #dee2e6'
          }}>
            {error.stack}
          </pre>
        </details>
      )}

      {onReset && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Reload Application
        </button>
      )}
    </div>
  );
};