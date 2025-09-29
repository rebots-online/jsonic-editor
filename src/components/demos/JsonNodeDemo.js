import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NodeType } from '../../types/core';
import { FileHandler } from '../../core/file-io/file-handler';
import { JsonParser } from '../../core/parser/json-parser';
import { JsonNode as JsonNodeComponent } from '../nodes/json-node-fixed';
import { testData } from '../../mocks/test-data';
const styles = {
    demoContainer: {
        padding: '20px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    jsonTree: {
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '10px',
        background: 'white',
        maxWidth: '600px',
        margin: '0 auto',
    },
    title: {
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    },
};
const JsonNodeDemo = () => {
    const [nodes, setNodes] = useState(testData);
    const [selectedNodeIds, setSelectedNodeIds] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});
    const fileHandler = new FileHandler();
    const parser = new JsonParser();
    const createNode = (type) => {
        return {
            id: uuidv4(),
            type,
            key: type === NodeType.OBJECT || type === NodeType.ARRAY ? '' : 'newKey',
            value: type === NodeType.STRING
                ? ''
                : type === NodeType.NUMBER
                    ? 0
                    : type === NodeType.BOOLEAN
                        ? false
                        : type === NodeType.NULL
                            ? null
                            : undefined,
            children: type === NodeType.OBJECT || type === NodeType.ARRAY ? [] : undefined,
            position: { x: 0, y: 0 },
            expanded: true,
        };
    };
    const handleSelect = (nodeId, e) => {
        setSelectedNodeIds(prev => {
            if (e && (e.shiftKey || e.ctrlKey || e.metaKey)) {
                return prev.includes(nodeId)
                    ? prev.filter(id => id !== nodeId)
                    : [...prev, nodeId];
            }
            return [nodeId];
        });
    };
    const handleUpdate = (nodeId, updates) => {
        const updateNode = (node) => {
            if (node.id === nodeId) {
                return { ...node, ...updates };
            }
            if (node.children) {
                return {
                    ...node,
                    children: node.children.map(updateNode),
                };
            }
            return node;
        };
        setNodes(prevNodes => ({
            ...prevNodes,
            children: prevNodes.children?.map(updateNode) || [],
        }));
    };
    const handleContextMenu = (e, node) => {
        e.preventDefault();
        console.log('Context menu for node:', node);
    };
    const handleDrop = (draggedId, parentId, index) => {
        const moveNode = (node) => {
            if (!node.children)
                return node;
            const draggedIdx = node.children.findIndex(c => c.id === draggedId);
            if (draggedIdx !== -1) {
                const [dragged] = node.children.splice(draggedIdx, 1);
                if (node.id === parentId) {
                    node.children.splice(index, 0, dragged);
                }
                else {
                    node.children = node.children.map(moveNode);
                    if (node.id === parentId) {
                        node.children.splice(index, 0, dragged);
                    }
                }
                return { ...node };
            }
            return { ...node, children: node.children.map(moveNode) };
        };
        setNodes(prev => ({ ...moveNode(prev) }));
    };
    const handleToggleExpand = (nodeId) => {
        setExpandedNodes(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));
    };
    const handleAddChild = (parentId, type, index = 0) => {
        const newNode = createNode(type);
        const addTo = (node) => {
            if (node.id === parentId) {
                const children = node.children ? [...node.children] : [];
                children.splice(index, 0, newNode);
                return { ...node, children };
            }
            return {
                ...node,
                children: node.children?.map(addTo),
            };
        };
        setNodes(prev => ({ ...prev, children: prev.children?.map(addTo) || [] }));
        setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
    };
    const handleOpenFile = async () => {
        try {
            const { nodes: parsed } = await fileHandler.openDocument();
            const root = {
                id: 'root',
                type: NodeType.OBJECT,
                key: 'root',
                position: { x: 0, y: 0 },
                expanded: true,
                children: parsed,
            };
            setNodes(root);
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleSaveFile = () => {
        const json = parser.serialize(nodes.children || []);
        fileHandler.saveFile(json, 'data.json');
    };
    const isNodeExpanded = (nodeId) => {
        return expandedNodes[nodeId] ?? true; // Default to expanded if not set
    };
    return (_jsxs("div", { style: styles.demoContainer, children: [_jsx("h2", { style: styles.title, children: "JSON Node Demo" }), _jsxs("div", { style: { textAlign: 'center', marginBottom: '10px' }, children: [_jsx("button", { onClick: handleOpenFile, children: "Open JSON" }), _jsx("button", { onClick: handleSaveFile, style: { marginLeft: '8px' }, children: "Save JSON" })] }), _jsx("div", { style: styles.jsonTree, children: nodes.children?.map((node) => (_jsx(JsonNodeComponent, { node: node, selectedIds: selectedNodeIds, onSelect: handleSelect, onUpdate: handleUpdate, onContextMenu: handleContextMenu, onDrop: handleDrop, onToggleExpand: handleToggleExpand, onAddChild: handleAddChild, isExpanded: isNodeExpanded(node.id), level: 0 }, node.id))) })] }));
};
export default JsonNodeDemo;
