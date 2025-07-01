export enum NodeType {
  OBJECT = 'object',
  ARRAY = 'array',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NULL = 'null'
}

export interface Position {
  x: number;
  y: number;
}

export interface JsonNode {
  id: string;
  type: NodeType;
  key?: string;
  value?: any;
  children?: JsonNode[];
  parent?: string;
  position: Position;
  expanded: boolean;
  path?: string[];
  isDragging?: boolean;
  isSelected?: boolean;
}

export interface NodeDropResult {
  draggedId: string;
  targetId: string;
  position?: 'before' | 'after' | 'inside';
}

export interface DocumentState {
  nodes: JsonNode[];
}

export interface UIState {
  activeNode: string | null;
  selectedNodes: string[];
}

export interface UserPreferences {
  theme: string;
  shortcuts: Record<string, string>;
}

export interface AppState {
  document: DocumentState;
  ui: UIState;
  preferences: UserPreferences;
}

export interface HistoryAction {
  type: string;
  payload: any;
}
