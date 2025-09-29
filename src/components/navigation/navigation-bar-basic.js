import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function NavigationBar({ onFileOpen, onFileSave, onPreferencesOpen }) {
    return (_jsxs("nav", { children: [_jsx("button", { onClick: onFileOpen, children: "Open" }), _jsx("button", { onClick: onFileSave, children: "Save" }), _jsx("button", { onClick: onPreferencesOpen, children: "Preferences" })] }));
}
