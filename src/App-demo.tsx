import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import JsonNodeDemo from './components/demos/JsonNodeDemo';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <header className="app-header">
          <h1>JSONIC Editor</h1>
        </header>
        <main className="app-main">
          <JsonNodeDemo />
        </main>
      </DndProvider>
    </div>
  );
};

export default App;