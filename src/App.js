import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { NavigationBar } from './components/navigation/navigation-bar';
import { FileHandler } from './core/file-io/file-handler';
import { JsonParser } from './core/parser/json-parser';
import { SpatialCanvas } from './components/canvas/spatial-canvas';
import './App-canvas.css';
console.log('📦 App.tsx: Starting to import modules...');
const fileHandler = new FileHandler();
const parser = new JsonParser();
const App = () => {
    const [appState, setAppState] = useState({
        document: {
            nodes: [],
        },
        ui: {
            activeNode: null,
            selectedNodes: [],
        },
        preferences: {
            theme: 'light',
            shortcuts: {},
        },
    });
    const handleFileOpen = useCallback(async () => {
        try {
            const { nodes: parsed } = await fileHandler.openDocument();
            setAppState(prev => ({
                ...prev,
                document: {
                    nodes: parsed,
                },
            }));
        }
        catch (err) {
            console.error('Failed to open file:', err);
        }
    }, []);
    const handleFileSave = useCallback(() => {
        try {
            const json = parser.serialize(appState.document.nodes);
            fileHandler.saveFile(json, 'data.json');
        }
        catch (err) {
            console.error('Failed to save file:', err);
        }
    }, [appState.document.nodes]);
    const handlePreferencesOpen = useCallback(() => {
        console.log('Open preferences');
    }, []);
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'o':
                        e.preventDefault();
                        handleFileOpen();
                        break;
                    case 's':
                        e.preventDefault();
                        handleFileSave();
                        break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleFileOpen, handleFileSave]);
    const handleNodeSelect = useCallback((nodeId, e) => {
        setAppState(prev => ({
            ...prev,
            ui: {
                ...prev.ui,
                activeNode: nodeId,
                selectedNodes: e && (e.shiftKey || e.ctrlKey || e.metaKey)
                    ? prev.ui.selectedNodes.includes(nodeId)
                        ? prev.ui.selectedNodes.filter(id => id !== nodeId)
                        : [...prev.ui.selectedNodes, nodeId]
                    : [nodeId],
            },
        }));
    }, []);
    const handleNodeUpdate = useCallback((nodeId, updates) => {
        setAppState(prev => ({
            ...prev,
            document: {
                nodes: prev.document.nodes.map(node => node.id === nodeId ? { ...node, ...updates } : node),
            },
        }));
    }, []);
    const handleNodeDrop = useCallback((draggedId, parentId, index) => {
        console.log('Drop:', draggedId, parentId, index);
    }, []);
    const handleToggleExpand = useCallback((nodeId) => {
        setAppState(prev => ({
            ...prev,
            document: {
                nodes: prev.document.nodes.map(node => node.id === nodeId ? { ...node, expanded: !node.expanded } : node),
            },
        }));
    }, []);
    const handleAddChild = useCallback((parentId, type, index) => {
        console.log('Add child:', parentId, type, index);
    }, []);
    const handleContextMenu = useCallback((e, node) => {
        e.preventDefault();
        console.log('Context menu:', node);
    }, []);
    return (_jsx("div", { className: "app", children: _jsxs(DndProvider, { backend: HTML5Backend, children: [_jsx(NavigationBar, { onFileOpen: handleFileOpen, onFileSave: handleFileSave, onPreferencesOpen: handlePreferencesOpen }), _jsx("main", { className: "app-main", children: appState.document.nodes.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("h2", { children: "Welcome to JSONIC Editor" }), _jsx("p", { children: "Open a JSON file to start editing, or create a new one." }), _jsx("button", { onClick: handleFileOpen, children: "Open JSON File" })] })) : (_jsx(SpatialCanvas, { nodes: appState.document.nodes, onNodeSelect: handleNodeSelect, onNodeUpdate: handleNodeUpdate, onNodeDrop: handleNodeDrop, onToggleExpand: handleToggleExpand, onAddChild: handleAddChild, onContextMenu: handleContextMenu, selectedNodes: appState.ui.selectedNodes })) })] }) }));
};
export default App;
