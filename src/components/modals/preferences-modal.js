import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ModalBase } from './modal-base';
export function PreferencesModal({ preferences, onSave, onCancel }) {
    const [theme, setTheme] = React.useState(preferences.theme);
    const handleSave = () => {
        onSave({ ...preferences, theme });
    };
    return (_jsxs(ModalBase, { isOpen: true, onClose: onCancel, title: "Preferences", children: [_jsxs("label", { children: ["Theme", _jsx("input", { value: theme, onChange: e => setTheme(e.target.value) })] }), _jsx("button", { onClick: handleSave, children: "Save" }), _jsx("button", { onClick: onCancel, children: "Cancel" })] }));
}
