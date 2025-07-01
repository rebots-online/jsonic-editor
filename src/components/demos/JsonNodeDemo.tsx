import React, { useState } from 'react';
import { JsonNode } from '../../types/core';
import { JsonNode as JsonNodeComponent } from '../nodes/json-node';
import { testData } from '../../mocks/test-data';

const styles = {
  demoContainer: {
    padding: '20px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  jsonTree: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '10px',
    background: 'white',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
};

const JsonNodeDemo: React.FC = () => {
  const [nodes, setNodes] = useState<JsonNode>(testData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const handleSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
  };

  const handleUpdate = (nodeId: string, updates: Partial<JsonNode>) => {
    const updateNode = (node: JsonNode): JsonNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode),
        };
      }
      return node;
    };

    setNodes(prevNodes => ({
      ...prevNodes,
      children: prevNodes.children?.map(updateNode) || [],
    }));
  };

  const handleContextMenu = (e: React.MouseEvent, node: JsonNode) => {
    e.preventDefault();
    console.log('Context menu for node:', node);
  };

  const handleDrop = (draggedId: string, targetId: string) => {
    console.log(`Dropped node ${draggedId} on ${targetId}`);
    // Implement node reordering logic here
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes[nodeId] ?? true; // Default to expanded if not set
  };

  return (
    <div style={styles.demoContainer}>
      <h2 style={styles.title}>JSON Node Demo</h2>
      <div style={styles.jsonTree}>
        {nodes.children?.map((node) => (
          <JsonNodeComponent
            key={node.id}
            node={node}
            isActive={selectedNodeId === node.id}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onContextMenu={handleContextMenu}
            onDrop={handleDrop}
            onToggleExpand={handleToggleExpand}
            isExpanded={isNodeExpanded(node.id)}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default JsonNodeDemo;
