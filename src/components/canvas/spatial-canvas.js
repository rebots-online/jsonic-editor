import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
import { JsonNode as JsonNodeComponent } from '../nodes/json-node';
import styles from './spatial-canvas.module.css';
export function SpatialCanvas({ nodes, onNodeSelect, onNodeUpdate, onNodeDrop, onToggleExpand, onAddChild, onContextMenu, selectedNodes, }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const canvasRef = useRef(null);
    // Auto-layout algorithm
    const calculateLayout = useCallback((nodes) => {
        const canvasNodes = nodes;
        const positionedNodes = new Map();
        const nodeWidth = 200;
        const nodeHeight = 100;
        const horizontalSpacing = 250;
        const verticalSpacing = 150;
        // Root nodes at the top
        const rootNodes = canvasNodes.filter(node => !node.parent);
        rootNodes.forEach((node, index) => {
            positionedNodes.set(node.id, {
                ...node,
                position: {
                    x: (index - rootNodes.length / 2) * horizontalSpacing,
                    y: 50,
                },
            });
        });
        // Position child nodes in a tree layout
        const positionChildren = (parentId, level) => {
            const children = canvasNodes.filter(node => node.parent === parentId);
            const parent = positionedNodes.get(parentId);
            if (!parent)
                return;
            children.forEach((child, index) => {
                const childX = parent.position.x + (index - children.length / 2) * horizontalSpacing / (level + 1);
                const childY = parent.position.y + verticalSpacing;
                positionedNodes.set(child.id, {
                    ...child,
                    position: { x: childX, y: childY },
                });
                // Recursively position grandchildren
                const grandchildren = canvasNodes.filter(node => node.parent === child.id);
                if (grandchildren.length > 0) {
                    positionChildren(child.id, level + 1);
                }
            });
        };
        // Start positioning from root nodes
        rootNodes.forEach(root => {
            positionChildren(root.id, 1);
        });
        return Array.from(positionedNodes.values());
    }, []);
    const [layoutNodes, setLayoutNodes] = useState([]);
    useEffect(() => {
        setLayoutNodes(calculateLayout(nodes));
    }, [nodes, calculateLayout]);
    // Calculate connections between nodes
    const calculateConnections = useCallback(() => {
        const connections = [];
        layoutNodes.forEach(node => {
            if (node.parent) {
                const parent = layoutNodes.find(n => n.id === node.parent);
                if (parent) {
                    connections.push({
                        from: parent.position,
                        to: node.position,
                    });
                }
            }
        });
        return connections;
    }, [layoutNodes]);
    const connections = calculateConnections();
    // Canvas interaction handlers
    const handleMouseDown = useCallback((e) => {
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            setIsPanning(true);
            setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            e.preventDefault();
        }
    }, [offset]);
    const handleMouseMove = useCallback((e) => {
        if (isPanning) {
            setOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    }, [isPanning, dragStart]);
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(3, scale * delta));
        setScale(newScale);
    }, [scale]);
    const handleZoomIn = useCallback(() => {
        setScale(prev => Math.min(3, prev * 1.2));
    }, []);
    const handleZoomOut = useCallback(() => {
        setScale(prev => Math.max(0.1, prev / 1.2));
    }, []);
    const handleResetView = useCallback(() => {
        setOffset({ x: 0, y: 0 });
        setScale(1);
    }, []);
    const transform = `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;
    return (_jsxs("div", { className: styles.spatialCanvas, children: [_jsx("div", { ref: canvasRef, className: styles.canvasContainer, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel, style: { cursor: isPanning ? 'grabbing' : 'grab' }, children: _jsxs("div", { className: styles.canvasContent, style: { transform }, children: [_jsxs("svg", { className: styles.connectionsLayer, style: { transform }, children: [connections.map((connection, index) => (_jsx("line", { x1: connection.from.x, y1: connection.from.y, x2: connection.to.x, y2: connection.to.y, stroke: "#1976d2", strokeWidth: "2", markerEnd: "url(#arrowhead)" }, index))), _jsx("defs", { children: _jsx("marker", { id: "arrowhead", markerWidth: "10", markerHeight: "7", refX: "9", refY: "3.5", orient: "auto", children: _jsx("polygon", { points: "0 0, 10 3.5, 0 7", fill: "#1976d2" }) }) })] }), layoutNodes.map((node) => (_jsx("div", { className: styles.canvasNode, style: {
                                position: 'absolute',
                                left: node.position.x,
                                top: node.position.y,
                                transform: `translate(-50%, -50%)`,
                                zIndex: selectedNodes.includes(node.id) ? 10 : 1,
                            }, children: _jsx(JsonNodeComponent, { node: node, selectedIds: selectedNodes, onSelect: onNodeSelect, onUpdate: onNodeUpdate, onContextMenu: onContextMenu, onDrop: onNodeDrop, onToggleExpand: onToggleExpand, onAddChild: onAddChild, isExpanded: node.expanded, level: 0 }) }, node.id)))] }) }), _jsxs("div", { className: styles.canvasControls, children: [_jsx("button", { onClick: handleZoomIn, title: "Zoom In", children: "\uD83D\uDD0D+" }), _jsx("button", { onClick: handleZoomOut, title: "Zoom Out", children: "\uD83D\uDD0D-" }), _jsx("button", { onClick: handleResetView, title: "Reset View", children: "\uD83C\uDFAF" }), _jsxs("span", { className: styles.zoomLevel, children: [Math.round(scale * 100), "%"] })] }), _jsxs("div", { className: styles.statusBar, children: [_jsxs("span", { children: [nodes.length, " nodes"] }), _jsx("span", { children: "Ctrl+Wheel to zoom \u2022 Middle-click to pan" }), _jsxs("span", { children: ["Scale: ", scale.toFixed(2), "x"] })] })] }));
}
