import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ErrorDisplay = ({ error, errorInfo, onReset, showDetails = false }) => {
    if (!error)
        return null;
    return (_jsxs("div", { className: "error-display", style: {
            padding: '20px',
            margin: '20px',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#fff5f5',
            color: '#c92a2a',
            fontFamily: 'monospace'
        }, children: [_jsx("h2", { style: { marginTop: 0, marginBottom: '16px' }, children: "\uD83D\uDD34 Application Error" }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("strong", { children: "Error:" }), " ", error.message] }), showDetails && errorInfo && (_jsxs("details", { style: { marginBottom: '16px' }, children: [_jsx("summary", { style: { cursor: 'pointer', marginBottom: '8px' }, children: "Component Stack Trace" }), _jsx("pre", { style: {
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderRadius: '4px',
                            overflow: 'auto',
                            fontSize: '12px',
                            border: '1px solid #dee2e6'
                        }, children: errorInfo.componentStack })] })), showDetails && error.stack && (_jsxs("details", { style: { marginBottom: '16px' }, children: [_jsx("summary", { style: { cursor: 'pointer', marginBottom: '8px' }, children: "Full Stack Trace" }), _jsx("pre", { style: {
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderRadius: '4px',
                            overflow: 'auto',
                            fontSize: '12px',
                            border: '1px solid #dee2e6'
                        }, children: error.stack })] })), onReset && (_jsx("button", { onClick: onReset, style: {
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }, children: "\uD83D\uDD04 Reload Application" }))] }));
};
