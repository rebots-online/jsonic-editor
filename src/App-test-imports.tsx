import React, { useState, useEffect } from 'react';

console.log('🧪 App-test-imports.tsx: Starting import tests...');

const AppTestImports: React.FC = () => {
  const [importStatus, setImportStatus] = useState<string>('Starting...');
  const [importErrors, setImportErrors] = useState<string[]>([]);

  useEffect(() => {
    const testImports = async () => {
      const errors: string[] = [];

      try {
        setImportStatus('Testing basic React...');
        await new Promise(resolve => setTimeout(resolve, 100));

        setImportStatus('Testing error boundary imports...');
        const { ErrorBoundary } = await import('./components/error-boundary/ErrorBoundary');
        console.log('✅ ErrorBoundary imported');

        setImportStatus('Testing types import...');
        const types = await import('./types/core');
        console.log('✅ Types imported');

        setImportStatus('Testing navigation import...');
        const { NavigationBar } = await import('./components/navigation/navigation-bar');
        console.log('✅ NavigationBar imported');

        setImportStatus('Testing file handler import...');
        const { FileHandler } = await import('./core/file-io/file-handler');
        console.log('✅ FileHandler imported');

        setImportStatus('Testing parser import...');
        const { JsonParser } = await import('./core/parser/json-parser');
        console.log('✅ JsonParser imported');

        setImportStatus('Testing react-dnd imports...');
        const { DndProvider } = await import('react-dnd');
        const { HTML5Backend } = await import('react-dnd-html5-backend');
        console.log('✅ react-dnd imported');

        setImportStatus('Testing spatial canvas import...');
        const { SpatialCanvas } = await import('./components/canvas/spatial-canvas');
        console.log('✅ SpatialCanvas imported');

        setImportStatus('Testing CSS import...');
        await import('./App-canvas.css');
        console.log('✅ CSS imported');

        setImportStatus('✅ All imports successful!');

      } catch (error) {
        console.error('❌ Import error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(errorMessage);
        setImportErrors(errors);
        setImportStatus('❌ Import failed');
      }
    };

    testImports();
  }, []);

  if (importErrors.length > 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fff5f5', color: '#c92a2a' }}>
        <h1>🔥 Import Test Failed</h1>
        <p>The following imports failed:</p>
        <ul>
          {importErrors.map((error, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <pre style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                {error}
              </pre>
            </li>
          ))}
        </ul>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1976d2', margin: '0 0 20px 0' }}>
        🧪 Import Test App
      </h1>

      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #1976d2'
      }}>
        <h2>Import Status: {importStatus}</h2>
        <div style={{ marginTop: '10px' }}>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: importStatus.includes('✅') ? '100%' :
                     importStatus.includes('Testing') ? '50%' : '10%',
              height: '100%',
              backgroundColor: importStatus.includes('✅') ? '#28a745' :
                               importStatus.includes('❌') ? '#dc3545' : '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {importStatus === '✅ All imports successful!' && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>✅ All Imports Working!</h3>
          <p>All required modules imported successfully. The main app should work now.</p>
          <button
            onClick={() => {
              // Switch to main app
              window.location.href = '/src/main.tsx';
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Try Main App
          </button>
        </div>
      )}

      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <h3>Debug Info:</h3>
        <p>Time: {new Date().toISOString()}</p>
        <p>React Version: {React.version}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default AppTestImports;