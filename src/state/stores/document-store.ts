import { JsonNode } from '../../types/core';

export class DocumentStore {
  private nodes: JsonNode[] = [];

  loadDocument(jsonData: any): void {
    this.nodes = jsonData as JsonNode[];
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
