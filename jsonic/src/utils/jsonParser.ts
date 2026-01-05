import { JsonNode, JsonGraph } from '../types/jsonTypes';
import { v4 as uuidv4 } from 'uuid';

// Convert JSON object to graph representation
export const jsonToGraph = (jsonObject: any, parentKey?: string, parentId?: string, path: string = ''): JsonGraph => {
  const nodes: JsonNode[] = [];
  const edges: JsonGraph['edges'] = [];
  const comments: Record<string, string[]> = {};

  const processValue = (value: any, key: string | undefined, parentId: string | undefined, currentPath: string): string => {
    const nodeId = uuidv4();
    let node: JsonNode;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Object node
      node = {
        id: nodeId,
        type: 'object',
        key,
        children: [],
        parent: parentId
      };

      // Process children
      Object.keys(value).forEach(childKey => {
        const childPath = `${currentPath}/${childKey}`;
        const childId = processValue(value[childKey], childKey, nodeId, childPath);
        if (node.children) {
          node.children.push(childId);
        }
        edges.push({
          id: uuidv4(),
          source: nodeId,
          target: childId,
          type: 'parent'
        });
      });
    } else if (Array.isArray(value)) {
      // Array node
      node = {
        id: nodeId,
        type: 'array',
        key,
        children: [],
        parent: parentId
      };

      // Process array elements
      value.forEach((element, index) => {
        const childPath = `${currentPath}/${index}`;
        const childId = processValue(element, `${index}`, nodeId, childPath);
        if (node.children) {
          node.children.push(childId);
        }
        edges.push({
          id: uuidv4(),
          source: nodeId,
          target: childId,
          type: 'parent'
        });
      });
    } else {
      // Primitive node
      node = {
        id: nodeId,
        type: value === null ? 'null' : typeof value as 'string' | 'number' | 'boolean',
        key,
        value,
        parent: parentId
      };
    }

    nodes.push(node);
    return nodeId;
  };

  // Start processing from root
  const rootId = processValue(jsonObject, parentKey, parentId, path);

  return {
    nodes,
    edges,
    metadata: {
      comments
    }
  };
};

// Convert graph representation back to JSON object
export const graphToJson = (graph: JsonGraph): any => {
  const nodeMap = new Map<string, JsonNode>();
  graph.nodes.forEach(node => nodeMap.set(node.id, node));

  const buildObject = (nodeId: string): any => {
    const node = nodeMap.get(nodeId);
    if (!node) return undefined;

    if (node.type === 'object') {
      const obj: any = {};
      if (node.children) {
        node.children.forEach(childId => {
          const childNode = nodeMap.get(childId);
          if (childNode && childNode.key !== undefined) {
            obj[childNode.key] = buildObject(childId);
          }
        });
      }
      return obj;
    } else if (node.type === 'array') {
      const arr: any[] = [];
      if (node.children) {
        node.children.forEach(childId => {
          arr.push(buildObject(childId));
        });
      }
      return arr;
    } else {
      return node.value;
    }
  };

  // Find root node (node without parent or with specific key)
  const rootNode = graph.nodes.find(node => !node.parent);
  if (rootNode) {
    return buildObject(rootNode.id);
  }

  return {};
};

// Find a node by ID
export const findNode = (graph: JsonGraph, nodeId: string): JsonNode | undefined => {
  return graph.nodes.find(node => node.id === nodeId);
};

// Add a child node to a parent
export const addChildNode = (graph: JsonGraph, parentId: string, node: Omit<JsonNode, 'id' | 'parent'>): JsonGraph => {
  const newNodeId = uuidv4();
  const newNode: JsonNode = {
    ...node,
    id: newNodeId,
    parent: parentId
  };

  const newNodes = graph.nodes.map(existingNode => {
    if (existingNode.id !== parentId) {
      return existingNode;
    }

    const updatedChildren = existingNode.children ? [...existingNode.children, newNodeId] : [newNodeId];

    return {
      ...existingNode,
      children: updatedChildren
    };
  });

  const newEdges: JsonGraph['edges'] = [
    ...graph.edges,
    {
      id: uuidv4(),
      source: parentId,
      target: newNodeId,
      type: 'parent'
    }
  ];

  return {
    ...graph,
    nodes: [...newNodes, newNode],
    edges: newEdges
  };
};

// Update a node
export const updateNode = (graph: JsonGraph, nodeId: string, updates: Partial<JsonNode>): JsonGraph => {
  const newNodes = graph.nodes.map(node => 
    node.id === nodeId ? { ...node, ...updates } : node
  );

  return {
    ...graph,
    nodes: newNodes
  };
};

// Add an edge between two nodes
export const addEdge = (
  graph: JsonGraph,
  sourceId: string,
  targetId: string,
  type: JsonGraph['edges'][number]['type'] = 'parent'
): JsonGraph => {
  const newEdges: JsonGraph['edges'] = [
    ...graph.edges,
    {
      id: uuidv4(),
      source: sourceId,
      target: targetId,
      type
    }
  ];

  return {
    ...graph,
    edges: newEdges
  };
};

// Remove a node and its descendants
export const removeNode = (graph: JsonGraph, nodeId: string): JsonGraph => {
  const nodeMap = new Map<string, JsonNode>(graph.nodes.map(node => [node.id, node]));
  const toRemove = new Set<string>();

  const collectDescendants = (id: string) => {
    if (toRemove.has(id)) return;
    toRemove.add(id);
    const current = nodeMap.get(id);
    current?.children?.forEach(childId => collectDescendants(childId));
  };

  collectDescendants(nodeId);

  const filteredNodes = graph.nodes.filter(node => !toRemove.has(node.id));
  const filteredEdges = graph.edges.filter(edge => !toRemove.has(edge.source) && !toRemove.has(edge.target));

  const prunedNodes = filteredNodes.map(node => {
    if (!node.children) {
      return node;
    }

    const remainingChildren = node.children.filter(childId => !toRemove.has(childId));

    if (remainingChildren.length !== node.children.length) {
      return { ...node, children: remainingChildren };
    }

    return node;
  });

  return {
    ...graph,
    nodes: prunedNodes,
    edges: filteredEdges
  };
};

// Move a node to a new parent (optionally updating its position)
export const moveNode = (
  graph: JsonGraph,
  nodeId: string,
  newParentId: string,
  position?: { x: number; y: number }
): JsonGraph => {
  const node = findNode(graph, nodeId);
  const newParent = findNode(graph, newParentId);

  if (!node || !newParent) {
    return graph;
  }

  const updatedNodes = graph.nodes.map(existingNode => {
    if (existingNode.id === nodeId) {
      return {
        ...existingNode,
        parent: newParentId,
        position: position ?? existingNode.position
      };
    }

    if (existingNode.id === node.parent) {
      const remainingChildren = existingNode.children?.filter(childId => childId !== nodeId) ?? [];
      return {
        ...existingNode,
        children: remainingChildren
      };
    }

    if (existingNode.id === newParentId) {
      const existingChildren = existingNode.children ?? [];
      const mergedChildren = existingChildren.includes(nodeId)
        ? existingChildren
        : [...existingChildren, nodeId];

      return {
        ...existingNode,
        children: mergedChildren
      };
    }

    return existingNode;
  });

  const filteredEdges = graph.edges.filter(edge => edge.target !== nodeId);
  const updatedEdges: JsonGraph['edges'] = [
    ...filteredEdges,
    {
      id: uuidv4(),
      source: newParentId,
      target: nodeId,
      type: 'parent'
    }
  ];

  return {
    ...graph,
    nodes: updatedNodes,
    edges: updatedEdges
  };
};
