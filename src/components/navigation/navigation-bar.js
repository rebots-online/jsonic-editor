import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './navigation.css';
export function NavigationBar({ onFileOpen, onFileSave, onPreferencesOpen }) {
    return (_jsxs("nav", { className: "navigation-bar", children: [_jsx("div", { className: "nav-section", children: _jsx("h1", { className: "app-title", children: "JSONIC Editor" }) }), _jsxs("div", { className: "nav-section", children: [_jsxs("div", { className: "nav-group", children: [_jsx("button", { className: "nav-button", onClick: onFileOpen, title: "Open JSON file (Ctrl+O)", children: "\uD83D\uDCC1 Open" }), _jsx("button", { className: "nav-button", onClick: onFileSave, title: "Save JSON file (Ctrl+S)", children: "\uD83D\uDCBE Save" })] }), _jsx("div", { className: "nav-group", children: _jsx("button", { className: "nav-button", onClick: onPreferencesOpen, title: "Preferences", children: "\u2699\uFE0F Preferences" }) })] })] }));
}
