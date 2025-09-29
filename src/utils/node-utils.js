import { NodeType } from '../types/core';
export const getNodeIcon = (type) => {
    switch (type) {
        case NodeType.OBJECT:
            return '{}';
        case NodeType.ARRAY:
            return '[]';
        case NodeType.STRING:
            return '"';
        case NodeType.NUMBER:
            return '#';
        case NodeType.BOOLEAN:
            return '✓';
        case NodeType.NULL:
            return '∅';
        default:
            return '?';
    }
};
export const getNodePath = (nodes, nodeId, path = []) => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return [...path, node.key || 'root'];
        }
        if (node.children) {
            const childPath = getNodePath(node.children, nodeId, [...path, node.key || 'root']);
            if (childPath)
                return childPath;
        }
    }
    return null;
};
export const findNodeById = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id)
            return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found)
                return found;
        }
    }
    return null;
};
export const updateNodeInTree = (nodes, nodeId, updates) => {
    return nodes.map((node) => {
        if (node.id === nodeId) {
            return { ...node, ...updates };
        }
        if (node.children) {
            return {
                ...node,
                children: updateNodeInTree(node.children, nodeId, updates),
            };
        }
        return node;
    });
};
