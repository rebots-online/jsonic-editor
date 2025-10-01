import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDocumentStore, useUIStore } from './stores';
import Navigation from './components/Navigation';
import Canvas from './components/Canvas';
import Modals from './components/Modals';
import StatusBar from './components/StatusBar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
const AppContainer = styled.div `
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.primary};
`;
const MainContent = styled.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;
const App = () => {
    const { document, loadJSON, createNewDocument } = useDocumentStore();
    const { ui, setLoading, setError } = useUIStore();
    // Initialize with sample data
    useEffect(() => {
        const sampleJSON = {
            "greeting": "Welcome to JSONIC Editor!",
            "type": "demonstration",
            "features": [
                "Visual JSON editing",
                "Keyboard navigation",
                "Multiple themes",
                "Undo/redo support"
            ],
            "settings": {
                "theme": "default-light",
                "autoSave": true,
                "fontSize": 14
            },
            "version": "1.0.0",
            "isActive": true
        };
        try {
            loadJSON(JSON.stringify(sampleJSON, null, 2));
        }
        catch (error) {
            console.error('Failed to load sample data:', error);
            createNewDocument();
        }
    }, [loadJSON, createNewDocument]);
    // Handle file operations
    const handleFileOpen = useCallback((event) => {
        const input = event.target;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    loadJSON(content);
                }
                catch (error) {
                    setError(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            };
            reader.onerror = () => {
                setError('Failed to read file');
            };
            reader.readAsText(file);
        }
        // Reset the input value so the same file can be selected again
        input.value = '';
    }, [loadJSON, setError]);
    const handleFileSave = useCallback(() => {
        try {
            const jsonString = document.nodes ?
                JSON.stringify(Object.values(document.nodes).find(node => !node.parentId)?.value || {}, null, 2) : '{}';
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.name || 'untitled'}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            setError(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [document, setError]);
    // Set up keyboard shortcuts
    useKeyboardShortcuts({
        'ctrl+o': () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = handleFileOpen;
            input.click();
        },
        'ctrl+s': handleFileSave,
        'ctrl+n': () => createNewDocument(),
        'ctrl+z': () => {
            const canUndo = useDocumentStore.getState().canUndo();
            if (canUndo)
                useDocumentStore.getState().undo();
        },
        'ctrl+y': () => {
            const canRedo = useDocumentStore.getState().canRedo();
            if (canRedo)
                useDocumentStore.getState().redo();
        },
    });
    return (_jsxs(AppContainer, { children: [_jsx(Navigation, { onFileOpen: handleFileOpen, onFileSave: handleFileSave, onNewDocument: () => createNewDocument() }), _jsx(MainContent, { children: _jsx(Canvas, {}) }), _jsx(StatusBar, {}), _jsx(Modals, {}), _jsx("input", { type: "file", id: "file-input", accept: ".json", style: { display: 'none' }, onChange: handleFileOpen })] }));
};
export default App;
