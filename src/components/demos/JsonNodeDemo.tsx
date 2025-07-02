import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { JsonNode, NodeType } from '../../types/core';
import { FileHandler } from '../../core/file-io/file-handler';
import { JsonParser } from '../../core/parser/json-parser';
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
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const fileHandler = new FileHandler();
  const parser = new JsonParser();
  const createNode = (type: NodeType): JsonNode => {
    return {
      id: uuidv4(),
      type,
      key: type === NodeType.OBJECT || type === NodeType.ARRAY ? '' : 'newKey',
      value:
        type === NodeType.STRING
          ? ''
          : type === NodeType.NUMBER
          ? 0
          : type === NodeType.BOOLEAN
          ? false
          : type === NodeType.NULL
          ? null
          : undefined,
      children: type === NodeType.OBJECT || type === NodeType.ARRAY ? [] : undefined,
      position: { x: 0, y: 0 },
      expanded: true,
    };
  };

  const handleSelect = (nodeId: string, e: React.MouseEvent) => {
    setSelectedNodeIds(prev => {
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        return prev.includes(nodeId)
          ? prev.filter(id => id !== nodeId)
          : [...prev, nodeId];
      }
      return [nodeId];
    });
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

  const handleAddChild = (parentId: string, type: NodeType) => {
    const newNode = createNode(type);
    const addTo = (node: JsonNode): JsonNode => {
      if (node.id === parentId) {
        const children = node.children ? [...node.children, newNode] : [newNode];
        return { ...node, children };
      }
      return {
        ...node,
        children: node.children?.map(addTo),
      };
    };
    setNodes(prev => ({ ...prev, children: prev.children?.map(addTo) || [] }));
    setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
  };

  const handleOpenFile = async () => {
    try {
      const parsed = await fileHandler.openJson();
      const root: JsonNode = {
        id: 'root',
        type: NodeType.OBJECT,
        key: 'root',
        position: { x: 0, y: 0 },
        expanded: true,
        children: parsed,
      };
      setNodes(root);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveFile = () => {
    const json = parser.serialize(nodes.children || []);
    fileHandler.saveFile(json, 'data.json');
  };

  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes[nodeId] ?? true; // Default to expanded if not set
  };

  return (
    <div style={styles.demoContainer}>
      <h2 style={styles.title}>JSON Node Demo</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={handleOpenFile}>Open JSON</button>
        <button onClick={handleSaveFile} style={{ marginLeft: '8px' }}>Save JSON</button>
      </div>
      <div style={styles.jsonTree}>
        {nodes.children?.map((node) => (
          <JsonNodeComponent
            key={node.id}
            node={node}
            selectedIds={selectedNodeIds}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onContextMenu={handleContextMenu}
            onDrop={handleDrop}
            onToggleExpand={handleToggleExpand}
            onAddChild={handleAddChild}
            isExpanded={isNodeExpanded(node.id)}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default JsonNodeDemo;
