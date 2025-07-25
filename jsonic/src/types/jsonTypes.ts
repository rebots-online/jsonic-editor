export interface JsonNode {
  id: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  key?: string;
  value?: any;
  children?: string[]; // References to child node IDs
  parent?: string; // Reference to parent node ID
  position?: { x: number; y: number };
  comments?: string[];
}

export interface JsonGraph {
  nodes: JsonNode[];
  edges: { 
    id: string;
    source: string; 
    target: string; 
    type: 'parent' | 'sibling' 
  }[];
  metadata: {
    comments: Record<string, string[]>;
    filePath?: string;
    lastModified?: Date;
  };
}

export interface CommentMap {
  [path: string]: string[];
}