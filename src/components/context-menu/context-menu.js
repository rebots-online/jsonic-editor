import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
export function ContextMenu({ node, position, onAction }) {
    useEffect(() => {
        const handle = () => onAction('close');
        document.addEventListener('click', handle);
        return () => document.removeEventListener('click', handle);
    }, [onAction]);
    const items = [{ label: 'Delete', action: 'delete' }];
    return (_jsx("ul", { className: "context-menu", style: { top: position.y, left: position.x }, children: items.map(i => (_jsx("li", { onClick: () => onAction(i.action), children: i.label }, i.action))) }));
}
