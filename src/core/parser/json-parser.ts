import { JsonNode } from '../../types/core';
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
      return data.map(item => this.createNode('array', undefined, undefined, this.convert(item as any, parent)));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => {
        const nodeType = this.getType(value);
        const children = nodeType === 'object' || nodeType === 'array' ? this.convert(value as any, key) : undefined;
        return this.createNode(nodeType, key, value, children, parent);
      });
    }
    return [this.createNode(this.getType(data), undefined, data, undefined, parent)];
  }

  private createNode(type: JsonNode['type'], key?: string, value?: any, children?: JsonNode[], parent?: string): JsonNode {
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

  private getType(value: any): JsonNode['type'] {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value as JsonNode['type'];
  }
}
