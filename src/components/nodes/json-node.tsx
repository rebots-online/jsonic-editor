import React from 'react';
import { JsonNode as Node } from '../../types/core';

interface Props {
  node: Node;
  isActive: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Node>) => void;
  onContextMenu: (id: string, x: number, y: number) => void;
}

export function JsonNode({ node, isActive, onSelect }: Props) {
  return (
    <div className={`json-node ${isActive ? 'active' : ''}`} onClick={() => onSelect(node.id)}>
      {node.key || node.type}
    </div>
  );
}
