import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { NodeManager } from '@/utils/NodeManager';
import { JSONParser } from '@/utils/JSONParser';
const createEmptyDocument = () => ({
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
export const useDocumentStore = create()(subscribeWithSelector((set, get) => ({
    document: createEmptyDocument(),
    loadJSON: (jsonString, documentId) => {
        try {
            const newDocument = JSONParser.parseJSON(jsonString, documentId);
            set({ document: newDocument });
        }
        catch (error) {
            console.error('Failed to load JSON:', error);
            throw error;
        }
    },
    createNewDocument: () => {
        set({ document: createEmptyDocument() });
    },
    updateDocument: (updates) => {
        const current = get().document;
        const updated = { ...current, ...updates };
        set({ document: updated });
        get()._addToHistory('Document updated');
    },
    addNode: (type, value, parentId = null, key, position) => {
        const current = get().document;
        const updated = NodeManager.addNode(current, type, value, parentId, key, position);
        set({ document: updated });
        get()._addToHistory(`Added ${type} node`);
    },
    updateNode: (nodeId, updates) => {
        const current = get().document;
        const updated = NodeManager.updateNode(current, nodeId, updates);
        set({ document: updated });
        get()._addToHistory(`Updated node ${nodeId}`);
    },
    deleteNode: (nodeId) => {
        const current = get().document;
        const updated = NodeManager.deleteNode(current, nodeId);
        set({ document: updated });
        get()._addToHistory(`Deleted node ${nodeId}`);
    },
    moveNode: (nodeId, position) => {
        const current = get().document;
        const updated = NodeManager.moveNode(current, nodeId, position);
        set({ document: updated });
        // Don't add to history for move operations to avoid too many history entries
    },
    selectNode: (nodeId, multiSelect = false) => {
        const current = get().document;
        const updated = NodeManager.selectNode(current, nodeId, multiSelect);
        set({ document: updated });
    },
    focusNode: (nodeId) => {
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
    expandNode: (nodeId, expanded = true) => {
        const current = get().document;
        const updated = NodeManager.expandNode(current, nodeId, expanded);
        set({ document: updated });
        get()._addToHistory(`${expanded ? 'Expanded' : 'Collapsed'} node ${nodeId}`);
    },
    collapseNode: (nodeId) => {
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
    autoLayout: (direction = 'vertical') => {
        const current = get().document;
        const updated = NodeManager.autoLayout(current, direction);
        set({ document: updated });
        get()._addToHistory(`Auto layout (${direction})`);
    },
    findNodes: (query) => {
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
    getNodePath: (nodeId) => {
        const current = get().document;
        return NodeManager.getNodePath(nodeId, current);
    },
    getNodeByPath: (path) => {
        const current = get().document;
        return NodeManager.getNodeByPath(current, path);
    },
    validateDocument: () => {
        const current = get().document;
        return NodeManager.validateNodeStructure(current);
    },
    _addToHistory: (description) => {
        const current = get().document;
        const historyState = {
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
    _restoreState: (state) => {
        set((currentState) => ({
            document: {
                ...currentState.document,
                nodes: { ...state.nodes },
                connections: [...state.connections],
            },
        }));
    },
})));
