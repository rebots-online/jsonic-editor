import React from 'react';
import { JsonNode } from '../../types/core';

interface Props {
  nodes: JsonNode[];
  onNodeSelect: (id: string) => void;
  onNodeUpdate: (id: string, updates: Partial<JsonNode>) => void;
}

export function EditorCanvas({ nodes }: Props) {
  return (
    <div className="editor-canvas">
      {nodes.length} nodes
    </div>
  );
}
