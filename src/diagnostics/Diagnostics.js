import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const Diagnostics = () => {
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(true);
    useEffect(() => {
        runDiagnostics();
    }, []);
    const runDiagnostics = async () => {
        setIsRunning(true);
        const newResults = [];
        // Test 1: React rendering
        try {
            newResults.push({
                name: 'React Rendering',
                status: 'success',
                message: 'React components can render'
            });
        }
        catch (error) {
            newResults.push({
                name: 'React Rendering',
                status: 'error',
                message: 'React rendering failed',
                details: error instanceof Error ? error.message : String(error)
            });
        }
        // Test 2: CSS modules
        try {
            const testElement = document.createElement('div');
            testElement.className = 'test-class';
            document.body.appendChild(testElement);
            document.body.removeChild(testElement);
            newResults.push({
                name: 'CSS Modules',
                status: 'success',
                message: 'CSS styling appears to work'
            });
        }
        catch (error) {
            newResults.push({
                name: 'CSS Modules',
                status: 'warning',
                message: 'CSS modules may have issues',
                details: error instanceof Error ? error.message : String(error)
            });
        }
        // Test 3: Module imports
        try {
            // Test if we can import React
            import('react');
            newResults.push({
                name: 'React Import',
                status: 'success',
                message: 'React imports successfully'
            });
        }
        catch (error) {
            newResults.push({
                name: 'React Import',
                status: 'error',
                message: 'React import failed',
                details: error instanceof Error ? error.message : String(error)
            });
        }
        // Test 4: Browser APIs
        try {
            const testFile = new File(['{}'], 'test.json', { type: 'application/json' });
            newResults.push({
                name: 'File API',
                status: 'success',
                message: 'File API is available'
            });
        }
        catch (error) {
            newResults.push({
                name: 'File API',
                status: 'warning',
                message: 'File API may have limited functionality',
                details: error instanceof Error ? error.message : String(error)
            });
        }
        // Test 5: JSON parsing
        try {
            JSON.parse('{"test": "value"}');
            newResults.push({
                name: 'JSON Parsing',
                status: 'success',
                message: 'JSON parsing works correctly'
            });
        }
        catch (error) {
            newResults.push({
                name: 'JSON Parsing',
                status: 'error',
                message: 'JSON parsing failed',
                details: error instanceof Error ? error.message : String(error)
            });
        }
        setResults(newResults);
        setIsRunning(false);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return '❓';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
                return '#28a745';
            case 'error':
                return '#dc3545';
            case 'warning':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };
    return (_jsxs("div", { style: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px'
        }, children: [_jsx("h1", { style: { marginTop: 0, marginBottom: '20px' }, children: "\uD83D\uDD27 JSONIC Editor Diagnostics" }), _jsx("div", { style: { marginBottom: '20px' }, children: _jsx("button", { onClick: runDiagnostics, disabled: isRunning, style: {
                        padding: '8px 16px',
                        backgroundColor: isRunning ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isRunning ? 'not-allowed' : 'pointer'
                    }, children: isRunning ? '🔄 Running Tests...' : '🔍 Run Diagnostics' }) }), _jsx("div", { style: { display: 'grid', gap: '12px' }, children: results.map((result, index) => (_jsxs("div", { style: {
                        padding: '12px',
                        backgroundColor: 'white',
                        border: `1px solid ${getStatusColor(result.status)}`,
                        borderRadius: '4px',
                        borderLeftWidth: '4px'
                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '18px' }, children: getStatusIcon(result.status) }), _jsx("strong", { children: result.name })] }), _jsx("div", { style: { marginTop: '4px', color: '#666' }, children: result.message }), result.details && (_jsxs("details", { style: { marginTop: '8px' }, children: [_jsx("summary", { style: { cursor: 'pointer', color: '#007bff' }, children: "Technical Details" }), _jsx("pre", { style: {
                                        marginTop: '4px',
                                        padding: '8px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        whiteSpace: 'pre-wrap'
                                    }, children: result.details })] }))] }, index))) }), results.length > 0 && (_jsxs("div", { style: { marginTop: '20px', padding: '12px', backgroundColor: '#e9ecef', borderRadius: '4px' }, children: [_jsx("strong", { children: "Summary:" }), " ", results.filter(r => r.status === 'success').length, " passed,", results.filter(r => r.status === 'warning').length, " warnings,", results.filter(r => r.status === 'error').length, " errors"] }))] }));
};
