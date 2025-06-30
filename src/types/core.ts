export interface JsonNode {
  id: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  key?: string;
  value?: any;
  children?: JsonNode[];
  parent?: string;
  position: { x: number; y: number };
  expanded: boolean;
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
