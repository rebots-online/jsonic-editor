import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { Diagnostics } from './diagnostics/Diagnostics';
console.log('🔍 App-debug.tsx: Loading...');
const AppDebug = () => {
    const [importStep, setImportStep] = useState(0);
    const [importError, setImportError] = useState(null);
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
    const [diagnosticsMode, setDiagnosticsMode] = useState(false);
    useEffect(() => {
        const testImports = async () => {
            try {
                console.log('📦 Step 1: Testing basic React...');
                setImportStep(1);
                await new Promise(resolve => setTimeout(resolve, 100));
                console.log('📦 Step 2: Testing complex imports...');
                setImportStep(2);
                // Try to import navigation bar
                console.log('📦 Importing NavigationBar...');
                const { NavigationBar } = await import('./components/navigation/navigation-bar');
                console.log('✅ NavigationBar imported successfully');
                // Try to import types
                console.log('📦 Importing types...');
                const types = await import('./types/core');
                console.log('✅ Types imported successfully');
                // Try to import FileHandler
                console.log('📦 Importing FileHandler...');
                const { FileHandler } = await import('./core/file-io/file-handler');
                console.log('✅ FileHandler imported successfully');
                // Try to import JsonParser
                console.log('📦 Importing JsonParser...');
                const { JsonParser } = await import('./core/parser/json-parser');
                console.log('✅ JsonParser imported successfully');
                console.log('📦 Step 3: Testing DnD imports...');
                setImportStep(3);
                // Try to import react-dnd
                console.log('📦 Importing react-dnd...');
                const { DndProvider } = await import('react-dnd');
                const { HTML5Backend } = await import('react-dnd-html5-backend');
                console.log('✅ react-dnd imported successfully');
                console.log('📦 Step 4: Testing SpatialCanvas...');
                setImportStep(4);
                // Try to import SpatialCanvas
                console.log('📦 Importing SpatialCanvas...');
                const { SpatialCanvas } = await import('./components/canvas/spatial-canvas');
                console.log('✅ SpatialCanvas imported successfully');
                console.log('📦 Step 5: Testing CSS...');
                setImportStep(5);
                // Try to import CSS
                console.log('📦 Importing CSS...');
                await import('./App-canvas.css');
                console.log('✅ CSS imported successfully');
                setImportStep(6); // All imports successful
            }
            catch (error) {
                console.error('❌ Import error:', error);
                setImportError(error instanceof Error ? error.message : String(error));
            }
        };
        testImports();
    }, []);
    const handleFileOpen = () => {
        console.log('📁 File open requested');
        // Mock file open for testing
        const mockNodes = [
            {
                id: '1',
                type: 'object',
                key: 'root',
                value: null,
                position: { x: 100, y: 100 },
                expanded: true
            }
        ];
        setAppState(prev => ({
            ...prev,
            document: { nodes: mockNodes }
        }));
    };
    const handleFileSave = () => {
        console.log('💾 File save requested');
    };
    const handlePreferencesOpen = () => {
        console.log('⚙️ Preferences requested');
        setDiagnosticsMode(true);
    };
    if (importError) {
        return (_jsxs("div", { style: { padding: '20px', backgroundColor: '#fff5f5', color: '#c92a2a' }, children: [_jsx("h1", { children: "\uD83D\uDD25 Import Error" }), _jsx("p", { children: "The application failed to import required modules:" }), _jsx("pre", { style: {
                        backgroundColor: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap'
                    }, children: importError }), _jsx("button", { onClick: () => window.location.reload(), style: {
                        padding: '8px 16px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '16px'
                    }, children: "Reload Page" })] }));
    }
    if (diagnosticsMode) {
        return (_jsxs("div", { children: [_jsx("div", { style: {
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000
                    }, children: _jsx("button", { onClick: () => setDiagnosticsMode(false), style: {
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }, children: "Close Diagnostics" }) }), _jsx(Diagnostics, {})] }));
    }
    return (_jsx(ErrorBoundary, { children: _jsxs("div", { style: {
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh'
            }, children: [_jsxs("div", { style: {
                        backgroundColor: '#1976d2',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }, children: [_jsx("h1", { style: { margin: 0 }, children: "\uD83D\uDD0D JSONIC Editor - Debug Mode" }), _jsxs("div", { style: { display: 'flex', gap: '20px', alignItems: 'center' }, children: [_jsxs("span", { children: ["Import Step: ", importStep, "/6"] }), _jsxs("span", { children: ["Status: ", importError ? '❌ Error' : importStep === 6 ? '✅ Ready' : '🔄 Loading'] }), _jsx("button", { onClick: () => setDiagnosticsMode(true), style: {
                                        padding: '4px 8px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }, children: "Run Diagnostics" })] })] }), _jsxs("div", { style: {
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }, children: [_jsx("h2", { children: "Navigation Bar (Test)" }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx("button", { onClick: handleFileOpen, style: {
                                        padding: '8px 16px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }, children: "\uD83D\uDCC1 Open File" }), _jsx("button", { onClick: handleFileSave, style: {
                                        padding: '8px 16px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }, children: "\uD83D\uDCBE Save File" }), _jsx("button", { onClick: handlePreferencesOpen, style: {
                                        padding: '8px 16px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }, children: "\u2699\uFE0F Preferences" })] })] }), _jsxs("div", { style: {
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '4px',
                        minHeight: '400px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }, children: [_jsx("h2", { children: "Main Content Area" }), appState.document.nodes.length === 0 ? (_jsxs("div", { style: {
                                textAlign: 'center',
                                padding: '40px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                border: '2px dashed #dee2e6'
                            }, children: [_jsx("h3", { children: "\uD83D\uDCC4 No JSON Loaded" }), _jsx("p", { children: "Click \"Open File\" to load a JSON file, or use the button below to load sample data." }), _jsx("button", { onClick: handleFileOpen, style: {
                                        padding: '10px 20px',
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '16px'
                                    }, children: "Load Sample Data" })] })) : (_jsxs("div", { children: [_jsx("h3", { children: "\uD83D\uDCCA JSON Data Loaded" }), _jsx("pre", { style: {
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        overflow: 'auto'
                                    }, children: JSON.stringify(appState.document.nodes, null, 2) })] }))] }), _jsxs("div", { style: {
                        position: 'fixed',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '8px 16px',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }, children: [_jsx("span", { children: "JSONIC Editor Debug Mode" }), _jsxs("span", { children: ["Nodes: ", appState.document.nodes.length] }), _jsxs("span", { children: ["Import Step: ", importStep, "/6"] })] })] }) }));
};
export default AppDebug;
