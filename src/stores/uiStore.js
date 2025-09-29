import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
const defaultTheme = {
    id: 'default-light',
    name: 'Default Light',
    type: 'light',
    colors: {
        primary: '#1976d2',
        secondary: '#7b1fa2',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#333333',
        border: '#cccccc',
        accent: '#ff4081',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
    },
    nodeStyles: {
        object: {
            backgroundColor: '#e3f2fd',
            borderColor: '#1976d2',
            borderWidth: 2,
            borderRadius: 25,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
        array: {
            backgroundColor: '#f3e5f5',
            borderColor: '#7b1fa2',
            borderWidth: 2,
            borderRadius: 15,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
        string: {
            backgroundColor: '#e8f5e8',
            borderColor: '#388e3c',
            borderWidth: 2,
            borderRadius: 20,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
        number: {
            backgroundColor: '#fff3e0',
            borderColor: '#f57c00',
            borderWidth: 2,
            borderRadius: 20,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
        boolean: {
            backgroundColor: '#fce4ec',
            borderColor: '#c2185b',
            borderWidth: 2,
            borderRadius: 20,
            color: '#333333',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
        null: {
            backgroundColor: '#f5f5f5',
            borderColor: '#757575',
            borderWidth: 2,
            borderRadius: 20,
            color: '#999999',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            padding: 12,
            margin: 8,
            shadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: 1,
        },
    },
    connectionStyle: {
        stroke: '#666666',
        strokeWidth: 2,
        opacity: 0.8,
    },
    fonts: {
        primary: 'Arial, sans-serif',
        monospace: 'Consolas, Monaco, monospace',
    },
};
const defaultPreferences = {
    themeId: 'default-light',
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    tabBehavior: 'create-child',
    keyboardShortcuts: {
        'undo': 'ctrl+z',
        'redo': 'ctrl+y',
        'save': 'ctrl+s',
        'open': 'ctrl+o',
        'new': 'ctrl+n',
        'delete': 'delete',
        'copy': 'ctrl+c',
        'paste': 'ctrl+v',
        'find': 'ctrl+f',
        'zoom-in': 'ctrl+plus',
        'zoom-out': 'ctrl+minus',
        'reset-zoom': 'ctrl+0',
        'toggle-grid': 'ctrl+g',
        'auto-layout': 'ctrl+l',
    },
    nodeDefaults: {
        width: 120,
        height: 60,
        fontSize: 14,
        padding: 12,
    },
    canvas: {
        gridSize: 20,
        showGrid: true,
        snapToGrid: true,
        autoLayout: false,
        layoutDirection: 'vertical',
    },
};
const defaultUIState = {
    theme: defaultTheme,
    viewport: {
        x: 0,
        y: 0,
        zoom: 1,
    },
    canvasSize: {
        width: 1200,
        height: 800,
    },
    isContextMenuOpen: false,
    contextMenuPosition: { x: 0, y: 0 },
    contextMenuNodeId: null,
    isModalOpen: false,
    modalType: null,
    isLoading: false,
    error: null,
};
export const useUIStore = create()(subscribeWithSelector((set, get) => ({
    ui: defaultUIState,
    preferences: defaultPreferences,
    setTheme: (theme) => {
        set((state) => ({
            ui: {
                ...state.ui,
                theme,
            },
            preferences: {
                ...state.preferences,
                themeId: theme.id,
            },
        }));
    },
    setCurrentTheme: (themeId) => {
        // This would typically load the theme from a themes registry
        // For now, we'll just update the preference
        set((state) => ({
            preferences: {
                ...state.preferences,
                themeId,
            },
        }));
    },
    setViewport: (viewport) => {
        set((state) => ({
            ui: {
                ...state.ui,
                viewport,
            },
        }));
    },
    setZoom: (zoom) => {
        set((state) => ({
            ui: {
                ...state.ui,
                viewport: {
                    ...state.ui.viewport,
                    zoom: Math.max(0.1, Math.min(3, zoom)),
                },
            },
        }));
    },
    panViewport: (dx, dy) => {
        set((state) => ({
            ui: {
                ...state.ui,
                viewport: {
                    ...state.ui.viewport,
                    x: state.ui.viewport.x + dx,
                    y: state.ui.viewport.y + dy,
                },
            },
        }));
    },
    setCanvasSize: (width, height) => {
        set((state) => ({
            ui: {
                ...state.ui,
                canvasSize: { width, height },
            },
        }));
    },
    showContextMenu: (position, nodeId) => {
        set((state) => ({
            ui: {
                ...state.ui,
                isContextMenuOpen: true,
                contextMenuPosition: position,
                contextMenuNodeId: nodeId || null,
            },
        }));
    },
    hideContextMenu: () => {
        set((state) => ({
            ui: {
                ...state.ui,
                isContextMenuOpen: false,
                contextMenuNodeId: null,
            },
        }));
    },
    showModal: (type) => {
        set((state) => ({
            ui: {
                ...state.ui,
                isModalOpen: true,
                modalType: type,
            },
        }));
    },
    hideModal: () => {
        set((state) => ({
            ui: {
                ...state.ui,
                isModalOpen: false,
                modalType: null,
            },
        }));
    },
    setLoading: (loading) => {
        set((state) => ({
            ui: {
                ...state.ui,
                isLoading: loading,
            },
        }));
    },
    setError: (error) => {
        set((state) => ({
            ui: {
                ...state.ui,
                error,
            },
        }));
    },
    clearError: () => {
        set((state) => ({
            ui: {
                ...state.ui,
                error: null,
            },
        }));
    },
    updatePreferences: (updates) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                ...updates,
            },
        }));
    },
    setAutoSave: (enabled) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                autoSave: enabled,
            },
        }));
    },
    setAutoSaveInterval: (interval) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                autoSaveInterval: interval,
            },
        }));
    },
    setTabBehavior: (behavior) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                tabBehavior: behavior,
            },
        }));
    },
    setKeyboardShortcut: (action, shortcut) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                keyboardShortcuts: {
                    ...state.preferences.keyboardShortcuts,
                    [action]: shortcut,
                },
            },
        }));
    },
    setNodeDefaults: (defaults) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                nodeDefaults: {
                    ...state.preferences.nodeDefaults,
                    ...defaults,
                },
            },
        }));
    },
    setCanvasSettings: (settings) => {
        set((state) => ({
            preferences: {
                ...state.preferences,
                canvas: {
                    ...state.preferences.canvas,
                    ...settings,
                },
            },
        }));
    },
    resetToDefaults: () => {
        set({
            ui: defaultUIState,
            preferences: defaultPreferences,
        });
    },
})));
