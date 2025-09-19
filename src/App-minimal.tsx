import React from 'react';

export const AppMinimal: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1976d2' }}>🎯 JSONIC Editor - Minimal Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <h2>✅ Basic Rendering Test</h2>
        <p>This is a minimal test to verify React components can render.</p>
      </div>
    </div>
  );
};