import { JsonNode } from '../../types/core';

export interface ValidationError {
  message: string;
  nodeId: string;
}

export class SchemaValidator {
  validateStructure(nodes: JsonNode[]): ValidationError[] {
    // placeholder - no rules yet
    return [];
  }

  validateNode(node: JsonNode): ValidationError[] {
    return [];
  }

  getValidationRules() {
    return [];
  }
}
