import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { JsonGraph } from '../types/jsonTypes';

interface GraphViewProps {
  graph: JsonGraph;
  onNodeSelect: (nodeId: string) => void;
  onNodeEdit: (nodeId: string, value: any) => void;
  onNodeCreate: (parentId: string, node: any) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeMove: (nodeId: string, newParentId: string) => void;
}

const GraphView: React.FC<GraphViewProps> = ({
  graph,
  onNodeSelect,
  onNodeEdit,
  onNodeCreate,
  onNodeDelete,
  onNodeMove
}) => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert our JSON graph to Cytoscape elements
  const convertToCytoscapeElements = () => {
    const nodes = graph.nodes.map(node => ({
      data: { 
        id: node.id, 
        label: node.key || (node.value !== undefined ? String(node.value) : node.type),
        type: node.type
      },
      position: node.position
    }));

    const edges = graph.edges.map(edge => ({
      data: { 
        id: edge.id,
        source: edge.source, 
        target: edge.target 
      }
    }));

    return [...nodes, ...edges];
  };

  // Initialize Cytoscape
  useEffect(() => {
    if (containerRef.current && !cyRef.current) {
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: convertToCytoscapeElements(),
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
        layout: {
          name: 'breadthfirst',
          directed: true,
          padding: 10,
          spacingFactor: 1.5,
          avoidOverlap: true,
          nodeDimensionsIncludeLabels: true
        }
      });

      // Add event listeners
      cyRef.current.on('tap', 'node', (event) => {
        const nodeId = event.target.id();
        onNodeSelect(nodeId);
      });
    }

    // Update elements when graph changes
    if (cyRef.current) {
      cyRef.current.elements().remove();
      cyRef.current.add(convertToCytoscapeElements());
      cyRef.current.layout({
        name: 'breadthfirst',
        directed: true,
        padding: 10,
        spacingFactor: 1.5,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true
      }).run();
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [graph]);

  return (
    <div className="graph-view" ref={containerRef} />
  );
};

export default GraphView;