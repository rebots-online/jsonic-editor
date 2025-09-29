import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavigationBar } from './components/navigation/navigation-bar';
console.log('📦 App-minimal.tsx: Starting minimal app...');
const App = () => {
    const [jsonContent, setJsonContent] = useState('');
    const handleFileOpen = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result;
                    setJsonContent(content);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };
    const handleFileSave = () => {
        if (!jsonContent)
            return;
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    const handlePreferencesOpen = () => {
        console.log('Open preferences');
    };
    return (_jsxs("div", { className: "app", children: [_jsx(NavigationBar, { onFileOpen: handleFileOpen, onFileSave: handleFileSave, onPreferencesOpen: handlePreferencesOpen }), _jsx("main", { className: "app-main", children: _jsxs("div", { className: "editor-container", children: [_jsxs("div", { className: "empty-state", children: [_jsx("h2", { children: "Welcome to JSONIC Editor" }), _jsx("p", { children: "Open a JSON file to start editing, or create a new one." }), _jsx("button", { onClick: handleFileOpen, children: "Open JSON File" })] }), jsonContent && (_jsxs("div", { className: "json-preview", children: [_jsx("h3", { children: "JSON Content:" }), _jsx("pre", { children: jsonContent })] }))] }) })] }));
};
export default App;
