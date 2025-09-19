import React, { useState } from 'react';
import { NavigationBar } from './components/navigation/navigation-bar';

console.log('📦 App-minimal.tsx: Starting minimal app...');

const App: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<string>('');

  const handleFileOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setJsonContent(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFileSave = () => {
    if (!jsonContent) return;

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreferencesOpen = () => {
    console.log('Open preferences');
  };

  return (
    <div className="app">
      <NavigationBar
        onFileOpen={handleFileOpen}
        onFileSave={handleFileSave}
        onPreferencesOpen={handlePreferencesOpen}
      />
      <main className="app-main">
        <div className="editor-container">
          <div className="empty-state">
            <h2>Welcome to JSONIC Editor</h2>
            <p>Open a JSON file to start editing, or create a new one.</p>
            <button onClick={handleFileOpen}>Open JSON File</button>
          </div>

          {jsonContent && (
            <div className="json-preview">
              <h3>JSON Content:</h3>
              <pre>{jsonContent}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;