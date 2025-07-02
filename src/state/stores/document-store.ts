import { JsonNode } from '../../types/core';
import { JsonParser } from '../../core/parser/json-parser';

export class DocumentStore {
  private nodes: JsonNode[] = [];

  loadDocument(jsonData: string | JsonNode[] | object): void {
    if (typeof jsonData === 'string') {
      const parser = new JsonParser();
      this.nodes = parser.parse(jsonData);
    } else if (Array.isArray(jsonData)) {
      this.nodes = jsonData as JsonNode[];
    } else {
      const parser = new JsonParser();
      this.nodes = parser.parse(JSON.stringify(jsonData));
    }
  }

  saveDocument(): string {
    const parser = new JsonParser();
    return parser.serialize(this.nodes);
  }

  updateNode(nodeId: string, updates: Partial<JsonNode>): void {
    const node = this.getNode(nodeId);
    if (node) Object.assign(node, updates);
  }

  addNode(parentId: string, node: JsonNode): void {
    const parent = this.getNode(parentId);
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
      node.parent = parentId;
    }
  }

  deleteNode(nodeId: string): void {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.nodes.forEach(n => this.removeFromChildren(n, nodeId));
  }

  private removeFromChildren(parent: JsonNode, id: string): void {
    if (!parent.children) return;
    parent.children = parent.children.filter(c => c.id !== id);
    parent.children.forEach(c => this.removeFromChildren(c, id));
  }

  getNode(nodeId: string): JsonNode | null {
    return this.findNode(this.nodes, nodeId);
  }

  getChildren(nodeId: string): JsonNode[] {
    const node = this.getNode(nodeId);
    return node?.children || [];
  }

  getParent(nodeId: string): JsonNode | null {
    const node = this.getNode(nodeId);
    return node && node.parent ? this.getNode(node.parent) : null;
  }

  private findNode(nodes: JsonNode[], id: string): JsonNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}
