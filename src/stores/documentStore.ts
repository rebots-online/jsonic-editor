import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DocumentState, JSONNode, NodeType, Position, HistoryState } from '@/types';
import { NodeManager } from '@/utils/NodeManager';
import { JSONParser } from '@/utils/JSONParser';

interface DocumentStore {
  document: DocumentState;

  // Actions
  loadJSON: (jsonString: string, documentId?: string) => void;
  createNewDocument: () => void;
  updateDocument: (updates: Partial<DocumentState>) => void;

  // Node operations
  addNode: (type: NodeType, value: any, parentId?: string | null, key?: string, position?: Position) => void;
  updateNode: (nodeId: string, updates: Partial<JSONNode>) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: Position) => void;

  // Selection and focus
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  focusNode: (nodeId: string) => void;
  clearSelection: () => void;

  // Node expansion
  expandNode: (nodeId: string, expanded?: boolean) => void;
  collapseNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // Layout
  autoLayout: (direction: 'vertical' | 'horizontal' | 'radial') => void;

  // Search
  findNodes: (query: string) => string[];

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Utility
  getNodePath: (nodeId: string) => string[];
  getNodeByPath: (path: string[]) => JSONNode | null;
  validateDocument: () => { isValid: boolean; errors: string[] };

  // Internal helpers
  _addToHistory: (description: string) => void;
  _restoreState: (state: HistoryState) => void;
}

const createEmptyDocument = (): DocumentState => ({
  id: 'default',
  name: 'Untitled',
  content: {},
  nodes: {},
  connections: [],
  selectedNodes: [],
  focusedNode: null,
  history: [],
  historyIndex: -1,
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0',
  },
});

export const useDocumentStore = create<DocumentStore>()(
  subscribeWithSelector((set, get) => ({
    document: createEmptyDocument(),

    loadJSON: (jsonString: string, documentId?: string) => {
      try {
        const newDocument = JSONParser.parseJSON(jsonString, documentId);
        set({ document: newDocument });
      } catch (error) {
        console.error('Failed to load JSON:', error);
        throw error;
      }
    },

    createNewDocument: () => {
      set({ document: createEmptyDocument() });
    },

    updateDocument: (updates: Partial<DocumentState>) => {
      const current = get().document;
      const updated = { ...current, ...updates };
      set({ document: updated });
      get()._addToHistory('Document updated');
    },

    addNode: (type: NodeType, value: any, parentId: string | null = null, key?: string, position?: Position) => {
      const current = get().document;
      const updated = NodeManager.addNode(current, type, value, parentId, key, position);
      set({ document: updated });
      get()._addToHistory(`Added ${type} node`);
    },

    updateNode: (nodeId: string, updates: Partial<JSONNode>) => {
      const current = get().document;
      const updated = NodeManager.updateNode(current, nodeId, updates);
      set({ document: updated });
      get()._addToHistory(`Updated node ${nodeId}`);
    },

    deleteNode: (nodeId: string) => {
      const current = get().document;
      const updated = NodeManager.deleteNode(current, nodeId);
      set({ document: updated });
      get()._addToHistory(`Deleted node ${nodeId}`);
    },

    moveNode: (nodeId: string, position: Position) => {
      const current = get().document;
      const updated = NodeManager.moveNode(current, nodeId, position);
      set({ document: updated });
      // Don't add to history for move operations to avoid too many history entries
    },

    selectNode: (nodeId: string, multiSelect: boolean = false) => {
      const current = get().document;
      const updated = NodeManager.selectNode(current, nodeId, multiSelect);
      set({ document: updated });
    },

    focusNode: (nodeId: string) => {
      const current = get().document;
      const updated = NodeManager.focusNode(current, nodeId);
      set({ document: updated });
    },

    clearSelection: () => {
      const current = get().document;
      const updated = {
        ...current,
        selectedNodes: [],
      };
      set({ document: updated });
    },

    expandNode: (nodeId: string, expanded: boolean = true) => {
      const current = get().document;
      const updated = NodeManager.expandNode(current, nodeId, expanded);
      set({ document: updated });
      get()._addToHistory(`${expanded ? 'Expanded' : 'Collapsed'} node ${nodeId}`);
    },

    collapseNode: (nodeId: string) => {
      const current = get().document;
      const updated = NodeManager.collapseNode(current, nodeId);
      set({ document: updated });
      get()._addToHistory(`Collapsed node ${nodeId}`);
    },

    expandAll: () => {
      const current = get().document;
      const updated = NodeManager.expandAll(current);
      set({ document: updated });
      get()._addToHistory('Expanded all nodes');
    },

    collapseAll: () => {
      const current = get().document;
      const updated = NodeManager.collapseAll(current);
      set({ document: updated });
      get()._addToHistory('Collapsed all nodes');
    },

    autoLayout: (direction: 'vertical' | 'horizontal' | 'radial' = 'vertical') => {
      const current = get().document;
      const updated = NodeManager.autoLayout(current, direction);
      set({ document: updated });
      get()._addToHistory(`Auto layout (${direction})`);
    },

    findNodes: (query: string) => {
      const current = get().document;
      return NodeManager.findNodes(current, query);
    },

    undo: () => {
      const current = get().document;
      if (current.historyIndex > 0) {
        const previousState = current.history[current.historyIndex - 1];
        get()._restoreState(previousState);

        set((state) => ({
          document: {
            ...state.document,
            historyIndex: current.historyIndex - 1,
          },
        }));
      }
    },

    redo: () => {
      const current = get().document;
      if (current.historyIndex < current.history.length - 1) {
        const nextState = current.history[current.historyIndex + 1];
        get()._restoreState(nextState);

        set((state) => ({
          document: {
            ...state.document,
            historyIndex: current.historyIndex + 1,
          },
        }));
      }
    },

    canUndo: () => {
      const current = get().document;
      return current.historyIndex > 0;
    },

    canRedo: () => {
      const current = get().document;
      return current.historyIndex < current.history.length - 1;
    },

    getNodePath: (nodeId: string) => {
      const current = get().document;
      return NodeManager.getNodePath(nodeId, current);
    },

    getNodeByPath: (path: string[]) => {
      const current = get().document;
      return NodeManager.getNodeByPath(current, path);
    },

    validateDocument: () => {
      const current = get().document;
      return NodeManager.validateNodeStructure(current);
    },

    _addToHistory: (description: string) => {
      const current = get().document;

      const historyState: HistoryState = {
        nodes: { ...current.nodes },
        connections: [...current.connections],
        timestamp: new Date(),
        description,
      };

      // Remove any future states if we're not at the end of the history
      const newHistory = current.history.slice(0, current.historyIndex + 1);
      newHistory.push(historyState);

      set((state) => ({
        document: {
          ...state.document,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        },
      }));
    },

    _restoreState: (state: HistoryState) => {
      set((currentState) => ({
        document: {
          ...currentState.document,
          nodes: { ...state.nodes },
          connections: [...state.connections],
        },
      }));
    },
  }))
);