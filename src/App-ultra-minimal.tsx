import React from 'react';

console.log('🧪 App-ultra-minimal.tsx: Component loading');

export const AppUltraMinimal: React.FC = () => {
  console.log('🧪 App-ultra-minimal.tsx: Component rendering');

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      border: '2px solid red'
    }}>
      <h1 style={{ color: 'red', margin: '0 0 20px 0' }}>
        🧪 ULTRA-MINIMAL TEST APP
      </h1>
      <p style={{ margin: '10px 0' }}>
        If you can see this, React is working!
      </p>
      <div style={{
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <h2>Test Elements:</h2>
        <ul>
          <li>✓ Basic HTML rendering</li>
          <li>✓ CSS styles applied</li>
          <li>✓ React component functioning</li>
        </ul>
        <button
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Debug info: {new Date().toISOString()}
      </div>
    </div>
  );
};

console.log('🧪 App-ultra-minimal.tsx: Component exported');

export default AppUltraMinimal;