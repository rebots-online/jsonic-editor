import { JsonParser } from '../../core/parser/json-parser';
export class DocumentStore {
    constructor() {
        this.nodes = [];
    }
    loadDocument(jsonData) {
        if (typeof jsonData === 'string') {
            const parser = new JsonParser();
            this.nodes = parser.parse(jsonData);
        }
        else if (Array.isArray(jsonData)) {
            this.nodes = jsonData;
        }
        else {
            const parser = new JsonParser();
            this.nodes = parser.parse(JSON.stringify(jsonData));
        }
    }
    saveDocument() {
        const parser = new JsonParser();
        return parser.serialize(this.nodes);
    }
    updateNode(nodeId, updates) {
        const node = this.getNode(nodeId);
        if (node)
            Object.assign(node, updates);
    }
    addNode(parentId, node, index) {
        const parent = this.getNode(parentId);
        if (parent) {
            parent.children = parent.children || [];
            if (index === undefined || index >= parent.children.length) {
                parent.children.push(node);
            }
            else {
                parent.children.splice(index, 0, node);
            }
            node.parent = parentId;
        }
    }
    moveNode(nodeId, newParentId, index) {
        const node = this.getNode(nodeId);
        const oldParent = node ? this.getParent(nodeId) : null;
        const newParent = this.getNode(newParentId);
        if (!node || !newParent)
            return;
        if (oldParent && oldParent.children) {
            oldParent.children = oldParent.children.filter(c => c.id !== nodeId);
        }
        else {
            this.nodes = this.nodes.filter(n => n.id !== nodeId);
        }
        newParent.children = newParent.children || [];
        if (index > newParent.children.length)
            index = newParent.children.length;
        newParent.children.splice(index, 0, node);
        node.parent = newParentId;
    }
    deleteNode(nodeId) {
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        this.nodes.forEach(n => this.removeFromChildren(n, nodeId));
    }
    removeFromChildren(parent, id) {
        if (!parent.children)
            return;
        parent.children = parent.children.filter(c => c.id !== id);
        parent.children.forEach(c => this.removeFromChildren(c, id));
    }
    getNode(nodeId) {
        return this.findNode(this.nodes, nodeId);
    }
    getChildren(nodeId) {
        const node = this.getNode(nodeId);
        return node?.children || [];
    }
    getParent(nodeId) {
        const node = this.getNode(nodeId);
        return node && node.parent ? this.getNode(node.parent) : null;
    }
    findNode(nodes, id) {
        for (const n of nodes) {
            if (n.id === id)
                return n;
            if (n.children) {
                const found = this.findNode(n.children, id);
                if (found)
                    return found;
            }
        }
        return null;
    }
}
