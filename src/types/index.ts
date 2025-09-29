import { v4 as uuidv4 } from 'uuid';

export type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export interface Position {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface JSONNode {
  id: string;
  type: NodeType;
  key?: string;
  value: any;
  parentId: string | null;
  children: string[];
  position: Position;
  dimension: Dimension;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  style: NodeStyle;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
}

export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  padding: number;
  margin: number;
  shadow: string;
  opacity: number;
}

export interface ConnectionState {
  from: string;
  to: string;
  type: 'parent-child' | 'sibling';
  style: ConnectionStyle;
}

export interface ConnectionStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity: number;
}

export interface DocumentState {
  id: string;
  name: string;
  content: any;
  nodes: Record<string, JSONNode>;
  connections: ConnectionState[];
  selectedNodes: string[];
  focusedNode: string | null;
  history: HistoryState[];
  historyIndex: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

export interface HistoryState {
  nodes: Record<string, JSONNode>;
  connections: ConnectionState[];
  timestamp: Date;
  description: string;
}

export interface UIState {
  theme: Theme;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  canvasSize: {
    width: number;
    height: number;
  };
  isContextMenuOpen: boolean;
  contextMenuPosition: Position;
  contextMenuNodeId: string | null;
  isModalOpen: boolean;
  modalType: 'preferences' | 'about' | 'file-open' | 'file-save' | null;
  isLoading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'glassmorphic' | 'skeuomorphic' | 'retro' | 'brutalist';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  nodeStyles: Partial<Record<NodeType, NodeStyle>>;
  connectionStyle: ConnectionStyle;
  fonts: {
    primary: string;
    monospace: string;
  };
}

export interface Preferences {
  themeId: string;
  autoSave: boolean;
  autoSaveInterval: number;
  tabBehavior: 'create-child' | 'navigate-siblings';
  keyboardShortcuts: Record<string, string>;
  nodeDefaults: {
    width: number;
    height: number;
    fontSize: number;
    padding: number;
  };
  canvas: {
    gridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
    autoLayout: boolean;
    layoutDirection: 'horizontal' | 'vertical' | 'radial';
  };
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: string;
  description: string;
  category: 'navigation' | 'editing' | 'file' | 'view' | 'help';
}

export interface ApplicationState {
  document: DocumentState;
  ui: UIState;
  preferences: Preferences;
  isInitialized: boolean;
}

export interface FileHandle {
  name: string;
  path: string;
  content: string;
  lastModified: Date;
  size: number;
}

export interface ValidationError {
  path: string;
  message: string;
  type: 'syntax' | 'schema' | 'type' | 'required';
  severity: 'error' | 'warning';
}

export interface NodeMenuAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  visible: (node: JSONNode) => boolean;
  enabled: (node: JSONNode) => boolean;
}

export interface ExportOptions {
  format: 'json' | 'pretty-json' | 'csv' | 'xml';
  includeMetadata: boolean;
  indentation: number | 'tab';
}