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

  const newNodes = [...graph.nodes, newNode];
  const newEdges = [...graph.edges, {
    id: uuidv4(),
    source: parentId,
    target: newNodeId,
    type: 'parent'
  }];

  return {
    ...graph,
    nodes: newNodes,
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