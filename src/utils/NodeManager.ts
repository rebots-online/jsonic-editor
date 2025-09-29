import { v4 as uuidv4 } from 'uuid';
import { JSONNode, Position, DocumentState, NodeType } from '@/types';
import { NodeModel } from './NodeModel';

export class NodeManager {
  static addNode(
    document: DocumentState,
    type: NodeType,
    value: any,
    parentId: string | null = null,
    key?: string,
    position?: Position
  ): DocumentState {
    const parentNode = parentId ? document.nodes[parentId] : null;

    const defaultPosition: Position = position || {
      x: parentNode ? parentNode.position.x + 200 : 400,
      y: parentNode ? parentNode.position.y + 100 : 50,
    };

    const newNode = NodeModel.createNode(type, value, key, parentId, defaultPosition);
    const updatedNodes = { ...document.nodes, [newNode.id]: newNode };

    if (parentNode && parentId) {
      const updatedParent = NodeModel.addChild(parentNode, newNode);
      updatedNodes[parentId] = updatedParent;
    }

    const newConnections = [...document.connections];
    if (parentId) {
      newConnections.push({
        from: parentId,
        to: newNode.id,
        type: 'parent-child',
        style: {
          stroke: '#666666',
          strokeWidth: 2,
          opacity: 0.8,
        },
      });
    }

    return {
      ...document,
      nodes: updatedNodes,
      connections: newConnections,
      focusedNode: newNode.id,
      selectedNodes: [newNode.id],
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static updateNode(document: DocumentState, nodeId: string, updates: Partial<JSONNode>): DocumentState {
    const node = document.nodes[nodeId];
    if (!node) return document;

    const updatedNode = NodeModel.updateNode(node, updates);
    const updatedNodes = {
      ...document.nodes,
      [nodeId]: updatedNode,
    };

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static deleteNode(document: DocumentState, nodeId: string): DocumentState {
    const node = document.nodes[nodeId];
    if (!node) return document;

    const nodesToDelete = this.getNodeAndAllDescendants(nodeId, document.nodes);
    const updatedNodes = { ...document.nodes };
    const updatedConnections = document.connections.filter(
      conn => !nodesToDelete.includes(conn.from) && !nodesToDelete.includes(conn.to)
    );

    nodesToDelete.forEach(id => {
      delete updatedNodes[id];
    });

    if (node.parentId) {
      const parentNode = updatedNodes[node.parentId];
      if (parentNode) {
        updatedNodes[node.parentId] = NodeModel.removeChild(parentNode, nodeId);
      }
    }

    const newSelectedNodes = document.selectedNodes.filter(id => !nodesToDelete.includes(id));
    const newFocusedNode = document.focusedNode && !nodesToDelete.includes(document.focusedNode)
      ? document.focusedNode
      : newSelectedNodes.length > 0
        ? newSelectedNodes[0]
        : Object.values(updatedNodes).find(n => !n.parentId)?.id || null;

    return {
      ...document,
      nodes: updatedNodes,
      connections: updatedConnections,
      selectedNodes: newSelectedNodes,
      focusedNode: newFocusedNode,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static moveNode(document: DocumentState, nodeId: string, newPosition: Position): DocumentState {
    const node = document.nodes[nodeId];
    if (!node) return document;

    const displacement = {
      x: newPosition.x - node.position.x,
      y: newPosition.y - node.position.y,
    };

    const nodesToUpdate = this.getNodeAndAllDescendants(nodeId, document.nodes);
    const updatedNodes = { ...document.nodes };

    nodesToUpdate.forEach(id => {
      const currentNode = updatedNodes[id];
      if (currentNode) {
        updatedNodes[id] = NodeModel.updateNode(currentNode, {
          position: {
            x: currentNode.position.x + displacement.x,
            y: currentNode.position.y + displacement.y,
          },
        });
      }
    });

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static selectNode(document: DocumentState, nodeId: string, multiSelect = false): DocumentState {
    const node = document.nodes[nodeId];
    if (!node) return document;

    let newSelectedNodes: string[];

    if (multiSelect) {
      newSelectedNodes = document.selectedNodes.includes(nodeId)
        ? document.selectedNodes.filter(id => id !== nodeId)
        : [...document.selectedNodes, nodeId];
    } else {
      newSelectedNodes = [nodeId];
    }

    return {
      ...document,
      selectedNodes: newSelectedNodes,
      focusedNode: nodeId,
    };
  }

  static focusNode(document: DocumentState, nodeId: string): DocumentState {
    const node = document.nodes[nodeId];
    if (!node) return document;

    const updatedNodes = { ...document.nodes };

    Object.values(updatedNodes).forEach(n => {
      updatedNodes[n.id] = NodeModel.updateNode(n, { isFocused: n.id === nodeId });
    });

    return {
      ...document,
      nodes: updatedNodes,
      focusedNode: nodeId,
    };
  }

  static expandNode(document: DocumentState, nodeId: string, expanded = true): DocumentState {
    const node = document.nodes[nodeId];
    if (!node || node.type !== 'object' && node.type !== 'array') return document;

    const updatedNode = NodeModel.updateNode(node, { isExpanded: expanded });
    const updatedNodes = {
      ...document.nodes,
      [nodeId]: updatedNode,
    };

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static collapseNode(document: DocumentState, nodeId: string): DocumentState {
    return this.expandNode(document, nodeId, false);
  }

  static expandAll(document: DocumentState): DocumentState {
    const updatedNodes = { ...document.nodes };

    Object.values(updatedNodes).forEach(node => {
      if (node.type === 'object' || node.type === 'array') {
        updatedNodes[node.id] = NodeModel.updateNode(node, { isExpanded: true });
      }
    });

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static collapseAll(document: DocumentState): DocumentState {
    const updatedNodes = { ...document.nodes };

    Object.values(updatedNodes).forEach(node => {
      if (node.type === 'object' || node.type === 'array') {
        updatedNodes[node.id] = NodeModel.updateNode(node, { isExpanded: false });
      }
    });

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static autoLayout(document: DocumentState, direction: 'vertical' | 'horizontal' | 'radial' = 'vertical'): DocumentState {
    const rootNode = Object.values(document.nodes).find(node => !node.parentId);
    if (!rootNode) return document;

    const updatedNodes = { ...document.nodes };
    const positionedNodes = new Set<string>();

    const layoutNode = (node: JSONNode, position: Position, level: number, index: number) => {
      if (positionedNodes.has(node.id)) return;

      positionedNodes.add(node.id);
      updatedNodes[node.id] = NodeModel.updateNode(node, { position });

      if (!node.isExpanded || node.children.length === 0) return;

      const childSpacing = direction === 'horizontal' ? 120 : 150;
      const levelSpacing = direction === 'horizontal' ? 200 : 120;

      node.children.forEach((childId, childIndex) => {
        const child = document.nodes[childId];
        if (!child) return;

        let childPosition: Position;

        switch (direction) {
          case 'horizontal':
            childPosition = {
              x: position.x + levelSpacing,
              y: position.y + (childIndex - node.children.length / 2) * childSpacing,
            };
            break;
          case 'vertical':
            childPosition = {
              x: position.x + (childIndex - node.children.length / 2) * childSpacing,
              y: position.y + levelSpacing,
            };
            break;
          case 'radial':
            const angle = (childIndex / node.children.length) * 2 * Math.PI;
            const radius = levelSpacing + level * 20;
            childPosition = {
              x: position.x + Math.cos(angle) * radius,
              y: position.y + Math.sin(angle) * radius,
            };
            break;
        }

        layoutNode(child, childPosition, level + 1, childIndex);
      });
    };

    layoutNode(rootNode, { x: 400, y: 50 }, 0, 0);

    return {
      ...document,
      nodes: updatedNodes,
      metadata: {
        ...document.metadata,
        updatedAt: new Date(),
      },
    };
  }

  static findNodes(document: DocumentState, query: string): string[] {
    const matchingNodes: string[] = [];
    const lowerQuery = query.toLowerCase();

    Object.values(document.nodes).forEach(node => {
      const searchableText = [
        node.key || '',
        NodeModel.getDisplayValue(node),
        NodeModel.getNodeTypeLabel(node.type),
      ].join(' ').toLowerCase();

      if (searchableText.includes(lowerQuery)) {
        matchingNodes.push(node.id);
      }
    });

    return matchingNodes;
  }

  static getNodePath(nodeId: string, document: DocumentState): string[] {
    const node = document.nodes[nodeId];
    if (!node) return [];

    return NodeModel.getNodePath(node, document.nodes);
  }

  static getNodeByPath(document: DocumentState, path: string[]): JSONNode | null {
    if (path.length === 0) return null;

    const rootNode = Object.values(document.nodes).find(node => !node.parentId);
    if (!rootNode) return null;

    let currentNode: JSONNode = rootNode;

    for (const key of path) {
      const childId = currentNode.children.find(childId => {
        const child = document.nodes[childId];
        return child?.key === key;
      });

      if (!childId) return null;
      currentNode = document.nodes[childId];
    }

    return currentNode;
  }

  static getParentChain(nodeId: string, document: DocumentState): JSONNode[] {
    const chain: JSONNode[] = [];
    let currentNode: JSONNode | null = document.nodes[nodeId];

    while (currentNode) {
      chain.unshift(currentNode);
      currentNode = currentNode.parentId ? document.nodes[currentNode.parentId] : null;
    }

    return chain;
  }

  static getSiblings(nodeId: string, document: DocumentState): JSONNode[] {
    const node = document.nodes[nodeId];
    if (!node || !node.parentId) return [];

    const parentNode = document.nodes[node.parentId];
    if (!parentNode) return [];

    return parentNode.children
      .filter(childId => childId !== nodeId)
      .map(childId => document.nodes[childId])
      .filter(Boolean);
  }

  private static getNodeAndAllDescendants(nodeId: string, nodes: Record<string, JSONNode>): string[] {
    const node = nodes[nodeId];
    if (!node) return [];

    const descendants: string[] = [nodeId];

    node.children.forEach(childId => {
      descendants.push(...this.getNodeAndAllDescendants(childId, nodes));
    });

    return descendants;
  }

  static validateNodeStructure(document: DocumentState): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rootNode = Object.values(document.nodes).find(node => !node.parentId);
    if (!rootNode) {
      errors.push('No root node found');
      return { isValid: false, errors };
    }

    const visitedNodes = new Set<string>();

    const validateNode = (node: JSONNode, depth: number = 0): void => {
      if (depth > 100) {
        errors.push(`Maximum depth exceeded at node ${node.id}`);
        return;
      }

      if (visitedNodes.has(node.id)) {
        errors.push(`Circular reference detected at node ${node.id}`);
        return;
      }

      visitedNodes.add(node.id);

      const nodeErrors = NodeModel.validateNode(node);
      errors.push(...nodeErrors.map(err => `Node ${node.id}: ${err}`));

      if (node.parentId) {
        const parentNode = document.nodes[node.parentId];
        if (!parentNode) {
          errors.push(`Node ${node.id} references non-existent parent ${node.parentId}`);
        } else if (!parentNode.children.includes(node.id)) {
          errors.push(`Parent ${node.parentId} does not reference child ${node.id}`);
        }
      }

      node.children.forEach(childId => {
        const child = document.nodes[childId];
        if (!child) {
          errors.push(`Node ${node.id} references non-existent child ${childId}`);
        } else if (child.parentId !== node.id) {
          errors.push(`Child ${childId} does not reference parent ${node.id}`);
        } else {
          validateNode(child, depth + 1);
        }
      });
    };

    validateNode(rootNode);

    const unvisitedNodes = Object.keys(document.nodes).filter(id => !visitedNodes.has(id));
    if (unvisitedNodes.length > 0) {
      errors.push(`Unreachable nodes: ${unvisitedNodes.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }
}