import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
export function ModalBase({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handle = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [onClose]);
    if (!isOpen)
        return null;
    return ReactDOM.createPortal(_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: "modal", onClick: e => e.stopPropagation(), children: [_jsx("h2", { children: title }), children] }) }), document.body);
}
