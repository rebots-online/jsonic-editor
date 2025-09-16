import React, { useState, useCallback, useRef, useEffect } from 'react';
import { JsonNode, NodeType } from '../../types/core';
import { JsonNode as JsonNodeComponent } from '../nodes/json-node';
import styles from './spatial-canvas.module.css';

interface Props {
  nodes: JsonNode[];
  onNodeSelect: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
  onNodeUpdate: (id: string, updates: Partial<JsonNode>) => void;
  onNodeDrop: (draggedId: string, parentId: string, index: number) => void;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string, type: NodeType, index?: number) => void;
  onContextMenu: (e: React.MouseEvent, node: JsonNode) => void;
  selectedNodes: string[];
}

interface CanvasNode extends JsonNode {
  position: { x: number; y: number };
}

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export function SpatialCanvas({
  nodes,
  onNodeSelect,
  onNodeUpdate,
  onNodeDrop,
  onToggleExpand,
  onAddChild,
  onContextMenu,
  selectedNodes,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-layout algorithm
  const calculateLayout = useCallback((nodes: JsonNode[]): CanvasNode[] => {
    const canvasNodes = nodes as CanvasNode[];
    const positionedNodes = new Map<string, CanvasNode>();
    const nodeWidth = 200;
    const nodeHeight = 100;
    const horizontalSpacing = 250;
    const verticalSpacing = 150;

    // Root nodes at the top
    const rootNodes = canvasNodes.filter(node => !node.parent);
    rootNodes.forEach((node, index) => {
      positionedNodes.set(node.id, {
        ...node,
        position: {
          x: (index - rootNodes.length / 2) * horizontalSpacing,
          y: 50,
        },
      });
    });

    // Position child nodes in a tree layout
    const positionChildren = (parentId: string, level: number) => {
      const children = canvasNodes.filter(node => node.parent === parentId);
      const parent = positionedNodes.get(parentId);

      if (!parent) return;

      children.forEach((child, index) => {
        const childX = parent.position.x + (index - children.length / 2) * horizontalSpacing / (level + 1);
        const childY = parent.position.y + verticalSpacing;

        positionedNodes.set(child.id, {
          ...child,
          position: { x: childX, y: childY },
        });

        // Recursively position grandchildren
        const grandchildren = canvasNodes.filter(node => node.parent === child.id);
        if (grandchildren.length > 0) {
          positionChildren(child.id, level + 1);
        }
      });
    };

    // Start positioning from root nodes
    rootNodes.forEach(root => {
      positionChildren(root.id, 1);
    });

    return Array.from(positionedNodes.values());
  }, []);

  const [layoutNodes, setLayoutNodes] = useState<CanvasNode[]>([]);

  useEffect(() => {
    setLayoutNodes(calculateLayout(nodes));
  }, [nodes, calculateLayout]);

  // Calculate connections between nodes
  const calculateConnections = useCallback((): Connection[] => {
    const connections: Connection[] = [];

    layoutNodes.forEach(node => {
      if (node.parent) {
        const parent = layoutNodes.find(n => n.id === node.parent);
        if (parent) {
          connections.push({
            from: parent.position,
            to: node.position,
          });
        }
      }
    });

    return connections;
  }, [layoutNodes]);

  const connections = calculateConnections();

  // Canvas interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      e.preventDefault();
    }
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  }, [scale]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(3, prev * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(0.1, prev / 1.2));
  }, []);

  const handleResetView = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setScale(1);
  }, []);

  const transform = `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;

  return (
    <div className={styles.spatialCanvas}>
      <div
        ref={canvasRef}
        className={styles.canvasContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          className={styles.canvasContent}
          style={{ transform }}
        >
          {/* Render connections */}
          <svg className={styles.connectionsLayer} style={{ transform }}>
            {connections.map((connection, index) => (
              <line
                key={index}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke="#1976d2"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            ))}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#1976d2"
                />
              </marker>
            </defs>
          </svg>

          {/* Render nodes */}
          {layoutNodes.map((node) => (
            <div
              key={node.id}
              className={styles.canvasNode}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                transform: `translate(-50%, -50%)`,
                zIndex: selectedNodes.includes(node.id) ? 10 : 1,
              }}
            >
              <JsonNodeComponent
                node={node}
                selectedIds={selectedNodes}
                onSelect={onNodeSelect}
                onUpdate={onNodeUpdate}
                onContextMenu={onContextMenu}
                onDrop={onNodeDrop}
                onToggleExpand={onToggleExpand}
                onAddChild={onAddChild}
                isExpanded={node.expanded}
                level={0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas controls */}
      <div className={styles.canvasControls}>
        <button onClick={handleZoomIn} title="Zoom In">
          🔍+
        </button>
        <button onClick={handleZoomOut} title="Zoom Out">
          🔍-
        </button>
        <button onClick={handleResetView} title="Reset View">
          🎯
        </button>
        <span className={styles.zoomLevel}>
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>{nodes.length} nodes</span>
        <span>Ctrl+Wheel to zoom • Middle-click to pan</span>
        <span>Scale: {scale.toFixed(2)}x</span>
      </div>
    </div>
  );
}