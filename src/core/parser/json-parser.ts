import { JsonNode, NodeType } from '../../types/core';
import { v4 as uuidv4 } from 'uuid';

export class JsonParser {
  parse(jsonString: string): JsonNode[] {
    const data = JSON.parse(jsonString);
    return this.convert(data);
  }

  serialize(nodes: JsonNode[]): string {
    return JSON.stringify(nodes, null, 2);
  }

  validate(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  private convert(data: any, parent?: string): JsonNode[] {
    if (Array.isArray(data)) {
      return data.map(item => this.createNode(NodeType.ARRAY, undefined, undefined, this.convert(item as any, parent)));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => {
        const nodeType = this.getType(value);
        const children = nodeType === NodeType.OBJECT || nodeType === NodeType.ARRAY ? this.convert(value as any, key) : undefined;
        return this.createNode(nodeType, key, value, children, parent);
      });
    }
    return [this.createNode(this.getType(data), undefined, data, undefined, parent)];
  }

  private createNode(type: NodeType, key?: string, value?: any, children?: JsonNode[], parent?: string): JsonNode {
    return {
      id: uuidv4(),
      type,
      key,
      value,
      children,
      parent,
      position: { x: 0, y: 0 },
      expanded: true
    };
  }

  private getType(value: any): NodeType {
    if (Array.isArray(value)) return NodeType.ARRAY;
    if (value === null) return NodeType.NULL;
    switch (typeof value) {
      case 'object':
        return NodeType.OBJECT;
      case 'string':
        return NodeType.STRING;
      case 'number':
        return NodeType.NUMBER;
      case 'boolean':
        return NodeType.BOOLEAN;
      default:
        return NodeType.NULL;
    }
  }
}
