import React from 'react';
import { JsonParser } from './core/parser/json-parser';
import { NavigationBar } from './components/navigation/navigation-bar';
import { EditorCanvas } from './components/canvas/editor-canvas';
import { JsonNode } from './types/core';

export function App() {
  const parser = new JsonParser();
  const [nodes, setNodes] = React.useState<JsonNode[]>([]);

  const handleFileLoad = (content: string) => {
    setNodes(parser.parse(content));
  };

  const handleFileSave = () => {
    const data = parser.serialize(nodes);
    console.log(data);
  };

  return (
    <div>
      <NavigationBar onFileOpen={() => {}} onFileSave={handleFileSave} onPreferencesOpen={() => {}} />
      <EditorCanvas nodes={nodes} onNodeSelect={() => {}} onNodeUpdate={() => {}} />
    </div>
  );
}
