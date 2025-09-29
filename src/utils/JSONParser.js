import { NodeModel } from './NodeModel';
export class JSONParser {
    static parseJSON(jsonString, documentId = 'default') {
        try {
            const parsed = JSON.parse(jsonString);
            const nodes = {};
            const connections = [];
            const rootNode = this.parseValue(parsed, null, null, { x: 400, y: 50 });
            nodes[rootNode.id] = rootNode;
            this.buildConnections(rootNode, nodes, connections);
            return {
                id: documentId,
                name: 'Untitled',
                content: parsed,
                nodes,
                connections,
                selectedNodes: [],
                focusedNode: rootNode.id,
                history: [],
                historyIndex: -1,
                metadata: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    version: '1.0.0',
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static serializeJSON(document) {
        try {
            if (document.focusedNode) {
                const rootNode = document.nodes[document.focusedNode];
                if (rootNode) {
                    return JSON.stringify(this.convertNodeToValue(rootNode, document.nodes), null, 2);
                }
            }
            const rootNode = Object.values(document.nodes).find(node => !node.parentId);
            if (rootNode) {
                return JSON.stringify(this.convertNodeToValue(rootNode, document.nodes), null, 2);
            }
            return '{}';
        }
        catch (error) {
            throw new Error(`Failed to serialize JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static parseValue(value, key, parentId, position, index = 0) {
        const nodePosition = {
            x: position.x + (index * 150),
            y: position.y + 100
        };
        if (value === null) {
            return NodeModel.createNode('null', null, key || undefined, parentId || undefined, nodePosition);
        }
        if (typeof value === 'boolean') {
            return NodeModel.createNode('boolean', value, key || undefined, parentId || undefined, nodePosition);
        }
        if (typeof value === 'number') {
            return NodeModel.createNode('number', value, key || undefined, parentId || undefined, nodePosition);
        }
        if (typeof value === 'string') {
            return NodeModel.createNode('string', value, key || undefined, parentId || undefined, nodePosition);
        }
        if (Array.isArray(value)) {
            const arrayNode = NodeModel.createNode('array', [], key || undefined, parentId || undefined, nodePosition);
            const children = value.map((item, i) => this.parseValue(item, null, arrayNode.id, { x: nodePosition.x, y: nodePosition.y }, i));
            children.forEach(child => {
                arrayNode.children.push(child.id);
            });
            return arrayNode;
        }
        if (typeof value === 'object' && value !== null) {
            const objectNode = NodeModel.createNode('object', {}, key || undefined, parentId || undefined, nodePosition);
            const entries = Object.entries(value);
            const children = entries.map(([entryKey, entryValue], i) => this.parseValue(entryValue, entryKey, objectNode.id, { x: nodePosition.x, y: nodePosition.y }, i));
            children.forEach(child => {
                objectNode.children.push(child.id);
            });
            return objectNode;
        }
        return NodeModel.createNode('string', String(value), key || undefined, parentId || undefined, nodePosition);
    }
    static convertNodeToValue(node, nodes) {
        switch (node.type) {
            case 'object':
                const obj = {};
                node.children.forEach(childId => {
                    const child = nodes[childId];
                    if (child && child.key) {
                        obj[child.key] = this.convertNodeToValue(child, nodes);
                    }
                });
                return obj;
            case 'array':
                const arr = [];
                node.children.forEach(childId => {
                    const child = nodes[childId];
                    if (child) {
                        arr.push(this.convertNodeToValue(child, nodes));
                    }
                });
                return arr;
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
                return node.value;
            default:
                return null;
        }
    }
    static buildConnections(rootNode, nodes, connections) {
        const processNode = (node) => {
            node.children.forEach(childId => {
                const child = nodes[childId];
                if (child) {
                    connections.push({
                        from: node.id,
                        to: child.id,
                        type: 'parent-child',
                        style: {
                            stroke: '#666666',
                            strokeWidth: 2,
                            opacity: 0.8,
                        },
                    });
                    if (child.children.length > 0) {
                        processNode(child);
                    }
                }
            });
        };
        processNode(rootNode);
    }
    static validateJSON(jsonString) {
        const errors = [];
        try {
            const parsed = JSON.parse(jsonString);
            const validateValue = (value, path = '') => {
                if (value === null)
                    return;
                if (typeof value === 'number') {
                    if (!isFinite(value)) {
                        errors.push(`Invalid number at ${path}: ${value}`);
                    }
                }
                if (typeof value === 'string') {
                    if (value.length > 10000) {
                        errors.push(`String too long at ${path}: ${value.length} characters`);
                    }
                }
                if (Array.isArray(value)) {
                    if (value.length > 1000) {
                        errors.push(`Array too large at ${path}: ${value.length} elements`);
                    }
                    value.forEach((item, index) => {
                        validateValue(item, `${path}[${index}]`);
                    });
                }
                if (typeof value === 'object' && value !== null) {
                    const keys = Object.keys(value);
                    if (keys.length > 100) {
                        errors.push(`Object has too many properties at ${path}: ${keys.length} properties`);
                    }
                    keys.forEach(key => {
                        if (typeof key !== 'string' || key.length === 0) {
                            errors.push(`Invalid property key at ${path}: ${key}`);
                        }
                        validateValue(value[key], `${path}.${key}`);
                    });
                }
            };
            validateValue(parsed);
            return { isValid: errors.length === 0, errors };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [error instanceof Error ? error.message : 'Invalid JSON'],
            };
        }
    }
    static formatJSON(jsonString, indentation = 2) {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, indentation);
        }
        catch (error) {
            throw new Error(`Cannot format invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static minifyJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed);
        }
        catch (error) {
            throw new Error(`Cannot minify invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static getNodeFromPath(document, path) {
        const pathParts = path.split('.').filter(part => part.length > 0);
        const rootNode = Object.values(document.nodes).find(node => !node.parentId);
        if (!rootNode)
            return null;
        let currentNode = rootNode;
        for (const part of pathParts) {
            const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
            if (arrayMatch) {
                const [, key, indexStr] = arrayMatch;
                const index = parseInt(indexStr, 10);
                if (currentNode.type === 'object') {
                    const childNode = currentNode.children
                        .map(childId => document.nodes[childId])
                        .find(child => child?.key === key);
                    if (!childNode || childNode.type !== 'array')
                        return null;
                    currentNode = childNode;
                }
                if (currentNode.type === 'array') {
                    if (index < 0 || index >= currentNode.children.length)
                        return null;
                    currentNode = document.nodes[currentNode.children[index]];
                }
                else {
                    return null;
                }
            }
            else {
                if (currentNode.type !== 'object')
                    return null;
                const childNode = currentNode.children
                    .map(childId => document.nodes[childId])
                    .find(child => child?.key === part);
                if (!childNode)
                    return null;
                currentNode = childNode;
            }
        }
        return currentNode;
    }
    static updateNodeFromPath(document, path, newValue) {
        const pathParts = path.split('.').filter(part => part.length > 0);
        const rootNode = Object.values(document.nodes).find(node => !node.parentId);
        if (!rootNode)
            return document;
        const updatedNodes = { ...document.nodes };
        const updateValue = (nodeId, parts) => {
            const node = updatedNodes[nodeId];
            if (!node)
                return false;
            if (parts.length === 0) {
                const newNode = NodeModel.createNode(this.getValueType(newValue), newValue, node.key, node.parentId, node.position);
                updatedNodes[nodeId] = newNode;
                return true;
            }
            const part = parts[0];
            const remainingParts = parts.slice(1);
            const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
            if (arrayMatch) {
                const [, key, indexStr] = arrayMatch;
                const index = parseInt(indexStr, 10);
                if (node.type === 'object') {
                    const childNode = node.children
                        .map(childId => updatedNodes[childId])
                        .find(child => child?.key === key);
                    if (childNode && childNode.type === 'array') {
                        return updateValue(childNode.id, [`${index}`, ...remainingParts]);
                    }
                }
            }
            else {
                if (node.type === 'object') {
                    const childNode = node.children
                        .map(childId => updatedNodes[childId])
                        .find(child => child?.key === part);
                    if (childNode) {
                        return updateValue(childNode.id, remainingParts);
                    }
                }
            }
            return false;
        };
        if (updateValue(rootNode.id, pathParts)) {
            return {
                ...document,
                nodes: updatedNodes,
                metadata: {
                    ...document.metadata,
                    updatedAt: new Date(),
                },
            };
        }
        return document;
    }
    static getValueType(value) {
        if (value === null)
            return 'null';
        if (typeof value === 'boolean')
            return 'boolean';
        if (typeof value === 'number')
            return 'number';
        if (typeof value === 'string')
            return 'string';
        if (Array.isArray(value))
            return 'array';
        if (typeof value === 'object')
            return 'object';
        return 'string';
    }
}
