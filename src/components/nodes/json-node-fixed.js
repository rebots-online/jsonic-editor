import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DropZone } from './drop-zone';
import { NodeType } from '../../types/core';
import { getNodeIcon } from '../../utils/node-utils';
import styles from './JsonNode.module.css';
export function JsonNode({ node, selectedIds, isExpanded = true, level = 0, onSelect, onUpdate, onContextMenu, onDrop, onToggleExpand, onAddChild, }) {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [useTextarea, setUseTextarea] = useState(false);
    const [addingIndex, setAddingIndex] = useState(null);
    const isActive = selectedIds.includes(node.id);
    const isExpandable = node.type === NodeType.OBJECT || node.type === NodeType.ARRAY;
    const hasChildren = isExpandable && Array.isArray(node.children) && node.children.length > 0;
    const [{ isDragging }, drag] = useDrag({
        type: 'NODE',
        item: { id: node.id, node, type: 'NODE' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'NODE',
        drop: (item) => {
            if (item.id !== node.id) {
                const index = node.children ? node.children.length : 0;
                onDrop(item.id, node.id, index);
            }
            return undefined;
        },
        canDrop: (item) => item.id !== node.id,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    drag(drop(ref));
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSelect(node.id, e);
        }
        else if (e.key === 'ArrowRight' && isExpandable && !isExpanded) {
            onToggleExpand?.(node.id);
        }
        else if (e.key === 'ArrowLeft' && isExpandable && isExpanded) {
            onToggleExpand?.(node.id);
        }
    };
    const handleToggleExpand = (e) => {
        e.stopPropagation();
        onToggleExpand?.(node.id);
    };
    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(node.id, e);
    };
    const handleValueClick = (e) => {
        e.stopPropagation();
        if (node.type !== NodeType.OBJECT && node.type !== NodeType.ARRAY) {
            const current = String(node.value ?? '');
            setEditValue(current);
            if (node.type === NodeType.STRING && (current.length > 30 || current.includes('\n'))) {
                setUseTextarea(true);
            }
            else {
                setUseTextarea(false);
            }
            setIsEditing(true);
        }
    };
    const handleEditChange = (e) => {
        if (node.type === NodeType.BOOLEAN && e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            setEditValue(String(e.target.checked));
        }
        else {
            setEditValue(e.target.value);
        }
    };
    const commitEdit = () => {
        let value = editValue;
        if (node.type === NodeType.NUMBER)
            value = Number(editValue);
        if (node.type === NodeType.BOOLEAN)
            value = editValue === 'true';
        if (node.type === NodeType.NULL)
            value = null;
        onUpdate(node.id, { value });
        setIsEditing(false);
    };
    const handleEditKey = (e) => {
        if (e.key === 'Enter') {
            commitEdit();
        }
        else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };
    const handleEditBlur = () => {
        commitEdit();
    };
    const handleContextMenu = (e) => {
        e.preventDefault();
        onContextMenu(e, node);
    };
    const handleAddClick = (e, index) => {
        e.stopPropagation();
        setAddingIndex(index);
    };
    const handleSelectAdd = (e, index) => {
        const value = e.target.value;
        if (value && onAddChild) {
            onAddChild(node.id, value, index);
        }
        setAddingIndex(null);
    };
    const cancelAdd = () => setAddingIndex(null);
    const nodeClasses = [
        styles.node,
        isActive ? styles.active : '',
        isDragging ? styles.dragging : '',
        isOver && canDrop ? styles.dropTarget : '',
        isEditing ? styles.editing : ''
    ].filter(Boolean).join(' ');
    const style = {
        '--level': level,
        '--indent': `${level * 16}px`
    };
    return (_jsxs("div", { ref: (element) => {
            drag(drop(element));
            ref.current = element;
        }, className: nodeClasses, style: style, onClick: handleClick, onContextMenu: handleContextMenu, onKeyDown: handleKeyDown, tabIndex: 0, role: "treeitem", "aria-expanded": isExpandable ? isExpanded : undefined, "aria-level": level + 1, "aria-selected": isActive, children: [_jsxs("div", { className: styles.nodeContent, children: [isExpandable && (_jsx("span", { className: styles.expandToggle, onClick: handleToggleExpand, children: isExpanded ? '▼' : '▶' })), _jsx("span", { className: styles.nodeIcon, children: getNodeIcon(node.type) }), node.key && _jsxs("span", { className: styles.nodeKey, children: [node.key, ":"] }), _jsx("span", { className: styles.nodeValue, onClick: handleValueClick, children: isEditing ? (node.type === NodeType.BOOLEAN ? (_jsx("input", { type: "checkbox", autoFocus: true, checked: editValue === 'true', onChange: handleEditChange, onBlur: handleEditBlur })) : useTextarea ? (_jsx("textarea", { autoFocus: true, value: editValue, onChange: handleEditChange, onBlur: handleEditBlur, onKeyDown: handleEditKey, rows: Math.min(Math.max(editValue.split('\n').length, 3), 10), className: styles.editField })) : (_jsx("input", { autoFocus: true, value: editValue, onChange: handleEditChange, onBlur: handleEditBlur, onKeyDown: handleEditKey, className: styles.editField }))) : (_jsxs(_Fragment, { children: [node.type === NodeType.OBJECT && !isExpanded && '{...} ', node.type === NodeType.ARRAY && !isExpanded && '[...] ', node.type === NodeType.STRING && `"${node.value}"`, node.type === NodeType.NUMBER && String(node.value), node.type === NodeType.BOOLEAN && String(node.value), node.type === NodeType.NULL && 'null'] })) }), isExpandable && (addingIndex !== null ? (_jsxs("select", { autoFocus: true, onBlur: cancelAdd, onChange: (e) => handleSelectAdd(e, addingIndex), className: styles.addSelect, children: [_jsx("option", { value: "", children: "add..." }), _jsx("option", { value: NodeType.OBJECT, children: "object" }), _jsx("option", { value: NodeType.ARRAY, children: "array" }), _jsx("option", { value: NodeType.STRING, children: "string" }), _jsx("option", { value: NodeType.NUMBER, children: "number" }), _jsx("option", { value: NodeType.BOOLEAN, children: "boolean" }), _jsx("option", { value: NodeType.NULL, children: "null" })] })) : (_jsx("button", { className: styles.addButton, onClick: (e) => handleAddClick(e, node.children ? node.children.length : 0), children: "+" })))] }), hasChildren && isExpanded && (_jsxs("div", { className: styles.nodeChildren, role: "group", children: [_jsxs("div", { className: styles.insertRow, children: [_jsx(DropZone, { parentId: node.id, index: 0, onDrop: onDrop }), _jsx("button", { className: styles.addButton, onClick: (e) => handleAddClick(e, 0), children: "+" })] }), node.children?.map((child, idx) => (_jsxs(React.Fragment, { children: [_jsx(JsonNode, { node: child, selectedIds: selectedIds, level: level + 1, onSelect: onSelect, onUpdate: onUpdate, onContextMenu: onContextMenu, onDrop: onDrop, onToggleExpand: onToggleExpand, onAddChild: onAddChild }), _jsxs("div", { className: styles.insertRow, children: [_jsx(DropZone, { parentId: node.id, index: idx + 1, onDrop: onDrop }), _jsx("button", { className: styles.addButton, onClick: (e) => handleAddClick(e, idx + 1), children: "+" })] })] }, child.id)))] }))] }));
}
