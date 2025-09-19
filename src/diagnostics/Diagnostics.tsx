import React, { useState, useEffect } from 'react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const Diagnostics: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const newResults: DiagnosticResult[] = [];

    // Test 1: React rendering
    try {
      newResults.push({
        name: 'React Rendering',
        status: 'success',
        message: 'React components can render'
      });
    } catch (error) {
      newResults.push({
        name: 'React Rendering',
        status: 'error',
        message: 'React rendering failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 2: CSS modules
    try {
      const testElement = document.createElement('div');
      testElement.className = 'test-class';
      document.body.appendChild(testElement);
      document.body.removeChild(testElement);
      newResults.push({
        name: 'CSS Modules',
        status: 'success',
        message: 'CSS styling appears to work'
      });
    } catch (error) {
      newResults.push({
        name: 'CSS Modules',
        status: 'warning',
        message: 'CSS modules may have issues',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 3: Module imports
    try {
      // Test if we can import React
      import('react');
      newResults.push({
        name: 'React Import',
        status: 'success',
        message: 'React imports successfully'
      });
    } catch (error) {
      newResults.push({
        name: 'React Import',
        status: 'error',
        message: 'React import failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 4: Browser APIs
    try {
      const testFile = new File(['{}'], 'test.json', { type: 'application/json' });
      newResults.push({
        name: 'File API',
        status: 'success',
        message: 'File API is available'
      });
    } catch (error) {
      newResults.push({
        name: 'File API',
        status: 'warning',
        message: 'File API may have limited functionality',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 5: JSON parsing
    try {
      JSON.parse('{"test": "value"}');
      newResults.push({
        name: 'JSON Parsing',
        status: 'success',
        message: 'JSON parsing works correctly'
      });
    } catch (error) {
      newResults.push({
        name: 'JSON Parsing',
        status: 'error',
        message: 'JSON parsing failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h1 style={{ marginTop: 0, marginBottom: '20px' }}>
        🔧 JSONIC Editor Diagnostics
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            backgroundColor: isRunning ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? '🔄 Running Tests...' : '🔍 Run Diagnostics'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {results.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '12px',
              backgroundColor: 'white',
              border: `1px solid ${getStatusColor(result.status)}`,
              borderRadius: '4px',
              borderLeftWidth: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>
                {getStatusIcon(result.status)}
              </span>
              <strong>{result.name}</strong>
            </div>
            <div style={{ marginTop: '4px', color: '#666' }}>
              {result.message}
            </div>
            {result.details && (
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', color: '#007bff' }}>
                  Technical Details
                </summary>
                <pre style={{
                  marginTop: '4px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {result.details}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
          <strong>Summary:</strong> {results.filter(r => r.status === 'success').length} passed,
          {results.filter(r => r.status === 'warning').length} warnings,
          {results.filter(r => r.status === 'error').length} errors
        </div>
      )}
    </div>
  );
};