import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cytoscape, { ElementDefinition } from 'cytoscape';
import { JsonGraph } from '../types/jsonTypes';

interface GraphViewProps {
  graph: JsonGraph;
  onNodeSelect: (payload: {
    id: string;
    key?: string;
    type: string;
    value?: any;
    position?: { x: number; y: number };
    parentId?: string;
  }) => void;
  onNodeEdit: (payload: {
    id: string;
    key?: string;
    type: string;
    value?: any;
    position?: { x: number; y: number };
    parentId?: string;
  }) => void;
  onNodeCreate: (payload: {
    parentId: string;
    position?: { x: number; y: number };
  }) => void;
  onNodeDelete: (payload: {
    id: string;
    parentId?: string;
  }) => void;
  onNodeMove: (payload: {
    id: string;
    newParentId: string;
    position?: { x: number; y: number };
  }) => void;
  onViewportChange?: (payload: { zoom: number; pan: { x: number; y: number } }) => void;
  onPositionsUpdate?: (positions: Record<string, { x: number; y: number }>) => void;
}

const GraphView: React.FC<GraphViewProps> = ({
  graph,
  onNodeSelect,
  onNodeEdit,
  onNodeCreate,
  onNodeDelete,
  onNodeMove,
  onViewportChange,
  onPositionsUpdate
}) => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    targetId: string | null;
    parentId?: string;
  } | null>(null);

  // Convert our JSON graph to Cytoscape elements
  const convertToCytoscapeElements = useMemo(() => {
    const nodes: ElementDefinition[] = graph.nodes.map(node => ({
      data: { 
        id: node.id, 
        label: node.key || (node.value !== undefined ? String(node.value) : node.type),
        type: node.type,
        key: node.key,
        value: node.value,
        parentId: node.parent
      },
      position: node.position
    }));

    const edges: ElementDefinition[] = graph.edges.map(edge => ({
      data: { 
        id: edge.id,
        source: edge.source, 
        target: edge.target,
        type: edge.type
      }
    }));

    return [...nodes, ...edges];
  }, [graph.edges, graph.nodes]);

  const layoutOptions = useMemo(
    () => ({
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      spacingFactor: 1.5,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true
    }),
    []
  );

  const syncPositionsToParent = () => {
    if (!cyRef.current || !onPositionsUpdate) return;
    const positions: Record<string, { x: number; y: number }> = {};
    cyRef.current.nodes().forEach(node => {
      positions[node.id()] = node.position();
    });
    onPositionsUpdate(positions);
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleContextAction = (action: 'edit' | 'add' | 'delete' | 'center') => {
    if (!contextMenu || !cyRef.current) return;

    const target = cyRef.current.getElementById(contextMenu.targetId ?? '');
    const data = target.data();
    const payload = {
      id: target.id(),
      key: data.key,
      type: data.type,
      value: data.value,
      position: target.position(),
      parentId: data.parentId as string | undefined
    };

    switch (action) {
      case 'edit':
        onNodeEdit(payload);
        break;
      case 'add':
        onNodeCreate({ parentId: target.id(), position: target.position() });
        break;
      case 'delete': {
        const shouldDelete = window.confirm('Delete this node and its descendants?');
        if (shouldDelete) {
          onNodeDelete({ id: target.id(), parentId: data.parentId as string | undefined });
        }
        break;
      }
      case 'center':
        target.select();
        target.cy().center(target);
        break;
      default:
        break;
    }

    closeContextMenu();
  };

  const getTraversalTargets = (node: cytoscape.NodeSingular) => {
    const parentEdge = node.incomers('edge[type = \"parent\"]').edges().first();
    const parentNode = parentEdge && parentEdge.isEdge() ? parentEdge.source() : undefined;

    const childEdge = node.outgoers('edge[type = \"parent\"]').edges().first();
    const childNode = childEdge && childEdge.isEdge() ? childEdge.target() : undefined;

    let prevSibling: cytoscape.NodeSingular | undefined;
    let nextSibling: cytoscape.NodeSingular | undefined;

    if (parentNode) {
      const siblings = parentNode.outgoers('edge[type = \"parent\"]').targets();
      const ids = siblings.map((sib: cytoscape.NodeSingular) => sib.id());
      const index = ids.indexOf(node.id());
      if (index > 0) {
        prevSibling = siblings[index - 1];
      }
      if (index >= 0 && index + 1 < siblings.length) {
        nextSibling = siblings[index + 1];
      }
    }

    return { parentNode, childNode, prevSibling, nextSibling };
  };

  const focusNode = (node?: cytoscape.NodeSingular) => {
    if (!node) return;
    node.select();
    node.cy().center(node);
    const data = node.data();
    onNodeSelect({
      id: node.id(),
      key: data.key,
      type: data.type,
      value: data.value,
      position: node.position(),
      parentId: data.parentId as string | undefined
    });
  };

  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!cyRef.current || !containerRef.current) return;

    const cy = cyRef.current;
    const nodes = cy.nodes();
    if (!nodes || nodes.length === 0) return;

    const selectedCollection = cy.$(':selected').nodes();
    const selected: cytoscape.NodeSingular = selectedCollection.nonempty() ? selectedCollection[0] : nodes[0];

    if (event.key === 'Tab') {
      event.preventDefault();
      const currentIndex = nodes.toArray().findIndex(node => node.id() === selected.id());
      const nextIndex = event.shiftKey
        ? (currentIndex - 1 + nodes.length) % nodes.length
        : (currentIndex + 1) % nodes.length;
      focusNode(nodes[nextIndex]);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const data = selected.data();
      onNodeEdit({
        id: selected.id(),
        key: data.key,
        type: data.type,
        value: data.value,
        position: selected.position(),
        parentId: data.parentId as string | undefined
      });
      return;
    }

    if (event.ctrlKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const { parentNode, childNode, prevSibling, nextSibling } = getTraversalTargets(selected);
      if (event.key === 'ArrowUp') {
        focusNode(parentNode);
      } else if (event.key === 'ArrowDown') {
        focusNode(childNode);
      } else if (event.key === 'ArrowLeft') {
        focusNode(prevSibling);
      } else if (event.key === 'ArrowRight') {
        focusNode(nextSibling);
      }
    }
  }, [onNodeEdit, onNodeSelect]);

  // Initialize Cytoscape
  useEffect(() => {
    if (containerRef.current && !cyRef.current) {
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: convertToCytoscapeElements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              'label': 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'shape': 'round-rectangle',
              'width': 'label',
              'height': 'label',
              'padding': '10px',
              'font-size': '14px',
              'color': '#fff',
              'text-outline-width': 2,
              'text-outline-color': '#666'
            }
          },
          {
            selector: 'node[type = "object"]',
            style: {
              'background-color': '#4a90e2'
            }
          },
          {
            selector: 'node[type = "array"]',
            style: {
              'background-color': '#7ed321'
            }
          },
          {
            selector: 'node[type = "primitive"]',
            style: {
              'background-color': '#f5a623',
              'shape': 'ellipse'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 2,
              'border-color': '#fff'
            }
          }
        ],
        layout: layoutOptions
      });

      const cyInstance = cyRef.current;

      // Add event listeners
      cyInstance.on('tap', 'node', (event) => {
        const nodeId = event.target.id();
        const data = event.target.data();
        onNodeSelect({
          id: nodeId,
          key: data.key,
          type: data.type,
          value: data.value,
          position: event.target.position(),
          parentId: data.parentId as string | undefined
        });
      });

      cyInstance.on('tap', (event) => {
        if (event.target === cyInstance) {
          cyInstance.elements().unselect();
          closeContextMenu();
        }
      });

      cyInstance.on('dbltap', 'node', event => {
        const data = event.target.data();
        onNodeEdit({
          id: event.target.id(),
          key: data.key,
          type: data.type,
          value: data.value,
          position: event.target.position(),
          parentId: data.parentId as string | undefined
        });
      });

      cyInstance.on('cxttap', 'node', event => {
        event.preventDefault();
        const { pageX, pageY } = event.originalEvent as MouseEvent;
        setContextMenu({
          x: pageX,
          y: pageY,
          targetId: event.target.id(),
          parentId: event.target.data('parentId') as string | undefined
        });
      });

      cyInstance.on('cxttap', event => {
        if (event.target === cyInstance) {
          closeContextMenu();
        }
      });

      cyInstance.on('dragfree', 'node', event => {
        const target = event.target;
        const dropPosition = event.position || target.position();

        const potentialParent = cyInstance.nodes().filter(node => {
          if (node.id() === target.id()) return false;
          const box = node.boundingBox();
          return (
            dropPosition.x >= box.x1 &&
            dropPosition.x <= box.x2 &&
            dropPosition.y >= box.y1 &&
            dropPosition.y <= box.y2
          );
        }).first();

        const newParentId = potentialParent && potentialParent.nonempty() ? potentialParent.id() : target.data('parentId');

        if (newParentId) {
          onNodeMove({
            id: target.id(),
            newParentId,
            position: dropPosition
          });
        }
      });

      cyInstance.on('zoom pan', () => {
        if (!onViewportChange) return;
        onViewportChange({
          zoom: cyInstance.zoom(),
          pan: cyInstance.pan()
        });
      });
    }

    // Update elements when graph changes
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.batch(() => {
        cy.elements().remove();
        cy.add(convertToCytoscapeElements);
      });

      const hasPositions = graph.nodes.every(node => !!node.position);
      if (!hasPositions) {
        const layout = cy.layout(layoutOptions);
        cy.one('layoutstop', () => syncPositionsToParent());
        layout.run();
      }
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [convertToCytoscapeElements, graph, layoutOptions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const listener = (event: KeyboardEvent) => handleKeyboardNavigation(event);
    container.addEventListener('keydown', listener);
    return () => container.removeEventListener('keydown', listener);
  }, [handleKeyboardNavigation]);

  return (
    <div className="graph-view" ref={containerRef} tabIndex={0} style={{ outline: 'none', position: 'relative' }}>
      {contextMenu && (
        <div
          className="graph-context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#2b2b2b',
            color: '#fff',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
            minWidth: 160
          }}
        >
          <button className="context-action" onClick={() => handleContextAction('edit')} style={menuButtonStyle}>Edit Node</button>
          <button className="context-action" onClick={() => handleContextAction('add')} style={menuButtonStyle}>Add Child</button>
          <button className="context-action" onClick={() => handleContextAction('delete')} style={menuButtonStyle}>Delete…</button>
          <button className="context-action" onClick={() => handleContextAction('center')} style={menuButtonStyle}>Center on Node</button>
        </div>
      )}
    </div>
  );
};

const menuButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer'
};

export default GraphView;
