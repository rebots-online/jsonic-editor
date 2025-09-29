import { v4 as uuidv4 } from 'uuid';
export class NodeModel {
    static createNode(type, value, key, parentId = null, position = { x: 0, y: 0 }) {
        return {
            id: uuidv4(),
            type,
            key,
            value,
            parentId,
            children: [],
            position,
            dimension: this.calculateDimensions(type, value),
            isExpanded: true,
            isSelected: false,
            isFocused: false,
            style: this.getDefaultStyle(type),
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
            },
        };
    }
    static updateNode(node, updates) {
        return {
            ...node,
            ...updates,
            metadata: {
                ...node.metadata,
                createdAt: node.metadata?.createdAt || new Date(),
                updatedAt: new Date(),
                version: (node.metadata?.version || 0) + 1,
            },
        };
    }
    static addChild(parent, child) {
        return {
            ...parent,
            children: [...parent.children, child.id],
            isExpanded: true,
            metadata: {
                ...parent.metadata,
                createdAt: parent.metadata?.createdAt || new Date(),
                updatedAt: new Date(),
                version: (parent.metadata?.version || 0) + 1,
            },
        };
    }
    static removeChild(parent, childId) {
        return {
            ...parent,
            children: parent.children.filter(id => id !== childId),
            metadata: {
                ...parent.metadata,
                createdAt: parent.metadata?.createdAt || new Date(),
                updatedAt: new Date(),
                version: (parent.metadata?.version || 0) + 1,
            },
        };
    }
    static calculateDimensions(type, value) {
        const baseWidth = 120;
        const baseHeight = 60;
        switch (type) {
            case 'object':
                return {
                    width: baseWidth + 40,
                    height: baseHeight + 20,
                };
            case 'array':
                return {
                    width: baseWidth + 20,
                    height: baseHeight + 10,
                };
            case 'string':
                const strLength = String(value).length;
                return {
                    width: Math.max(baseWidth, strLength * 8 + 40),
                    height: baseHeight,
                };
            case 'number':
                return {
                    width: baseWidth,
                    height: baseHeight - 10,
                };
            case 'boolean':
                return {
                    width: baseWidth - 20,
                    height: baseHeight - 10,
                };
            case 'null':
                return {
                    width: baseWidth - 20,
                    height: baseHeight - 10,
                };
            default:
                return { width: baseWidth, height: baseHeight };
        }
    }
    static getDefaultStyle(type) {
        const baseStyle = {
            backgroundColor: '#ffffff',
            borderColor: '#cccccc',
            borderWidth: 2,
            borderRadius: 20,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        };
        switch (type) {
            case 'object':
                return {
                    ...baseStyle,
                    backgroundColor: '#e3f2fd',
                    borderColor: '#1976d2',
                    borderRadius: 25,
                };
            case 'array':
                return {
                    ...baseStyle,
                    backgroundColor: '#f3e5f5',
                    borderColor: '#7b1fa2',
                    borderRadius: 15,
                };
            case 'string':
                return {
                    ...baseStyle,
                    backgroundColor: '#e8f5e8',
                    borderColor: '#388e3c',
                };
            case 'number':
                return {
                    ...baseStyle,
                    backgroundColor: '#fff3e0',
                    borderColor: '#f57c00',
                };
            case 'boolean':
                return {
                    ...baseStyle,
                    backgroundColor: '#fce4ec',
                    borderColor: '#c2185b',
                };
            case 'null':
                return {
                    ...baseStyle,
                    backgroundColor: '#f5f5f5',
                    borderColor: '#757575',
                    color: '#999999',
                };
            default:
                return baseStyle;
        }
    }
    static getDisplayValue(node) {
        switch (node.type) {
            case 'object':
                return `{${Object.keys(node.value).length}}`;
            case 'array':
                return `[${node.value.length}]`;
            case 'string':
                return `"${node.value}"`;
            case 'number':
                return String(node.value);
            case 'boolean':
                return String(node.value);
            case 'null':
                return 'null';
            default:
                return String(node.value);
        }
    }
    static getNodeTypeLabel(type) {
        switch (type) {
            case 'object':
                return 'Object';
            case 'array':
                return 'Array';
            case 'string':
                return 'String';
            case 'number':
                return 'Number';
            case 'boolean':
                return 'Boolean';
            case 'null':
                return 'Null';
            default:
                return 'Unknown';
        }
    }
    static validateNode(node) {
        const errors = [];
        if (!node.id) {
            errors.push('Node ID is required');
        }
        if (!node.type) {
            errors.push('Node type is required');
        }
        if (node.position === undefined) {
            errors.push('Node position is required');
        }
        if (node.dimension === undefined) {
            errors.push('Node dimension is required');
        }
        return errors;
    }
    static cloneNode(node) {
        return {
            ...node,
            id: uuidv4(),
            children: [...node.children],
            metadata: {
                ...node.metadata,
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
            },
        };
    }
    static getNodePath(node, nodes) {
        const path = [];
        let currentNode = node;
        while (currentNode) {
            if (currentNode.key) {
                path.unshift(currentNode.key);
            }
            currentNode = currentNode.parentId ? nodes[currentNode.parentId] : null;
        }
        return path;
    }
    static findNodeByPath(nodes, path) {
        if (path.length === 0)
            return null;
        const rootNode = Object.values(nodes).find(node => !node.parentId);
        if (!rootNode)
            return null;
        let currentNode = rootNode;
        for (const key of path) {
            const childId = currentNode.children.find(childId => {
                const child = nodes[childId];
                return child?.key === key;
            });
            if (!childId)
                return null;
            currentNode = nodes[childId];
        }
        return currentNode;
    }
}
