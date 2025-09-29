import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
        this.handleReset = () => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null
            });
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsxs("div", { style: {
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    backgroundColor: '#fff5f5',
                    color: '#c92a2a'
                }, children: [_jsx("h2", { children: "Something went wrong" }), _jsxs("details", { style: { whiteSpace: 'pre-wrap' }, children: [_jsx("summary", { children: "Error details" }), _jsx("p", { children: this.state.error?.toString() }), _jsx("p", { children: this.state.errorInfo?.componentStack })] }), _jsx("button", { onClick: this.handleReset, style: {
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }, children: "Try again" })] }));
        }
        return this.props.children;
    }
}
