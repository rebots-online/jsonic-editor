import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDocumentStore, useUIStore } from '@/stores';
import Node from '../Node';
const CanvasContainer = styled.div `
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
  background-image:
    radial-gradient(circle, ${props => props.theme.colors.border} 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
`;
const SVGCanvas = styled.svg `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
const ZoomControls = styled.div `
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const ZoomButton = styled.button `
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }

  &:active {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;
const ZoomLevel = styled.div `
  text-align: center;
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  padding: 4px;
  font-family: ${props => props.theme.fonts.monospace};
`;
const EmptyState = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;
const EmptyStateTitle = styled.h2 `
  font-size: 24px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.primary};
`;
const EmptyStateText = styled.p `
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.8;
`;
const EmptyStateButton = styled.button `
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
  }
`;
const Canvas = () => {
    const canvasRef = useRef(null);
    const { document, selectedNodes, focusedNode } = useDocumentStore();
    const { ui, setViewport, setCanvasSize } = useUIStore();
    // Handle canvas resize
    const handleResize = useCallback(() => {
        if (canvasRef.current) {
            const { width, height } = canvasRef.current.getBoundingClientRect();
            setCanvasSize(width, height);
        }
    }, [setCanvasSize]);
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    // Handle wheel zoom
    const handleWheel = useCallback((event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Math.max(0.1, Math.min(3, ui.viewport.zoom + delta));
            setViewport({ ...ui.viewport, zoom: newZoom });
        }
    }, [ui.viewport, setViewport]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('wheel', handleWheel, { passive: false });
            return () => canvas.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);
    // Handle pan
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const handleMouseDown = useCallback((event) => {
        if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
            setIsPanning(true);
            setPanStart({ x: event.clientX, y: event.clientY });
            event.preventDefault();
        }
    }, []);
    const handleMouseMove = useCallback((event) => {
        if (isPanning) {
            const dx = event.clientX - panStart.x;
            const dy = event.clientY - panStart.y;
            setViewport({
                ...ui.viewport,
                x: ui.viewport.x + dx,
                y: ui.viewport.y + dy,
            });
            setPanStart({ x: event.clientX, y: event.clientY });
        }
    }, [isPanning, panStart, ui.viewport, setViewport]);
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    // Transform for viewport
    const getTransform = () => {
        return `translate(${ui.viewport.x}px, ${ui.viewport.y}px) scale(${ui.viewport.zoom})`;
    };
    const handleZoomIn = () => {
        setViewport({ ...ui.viewport, zoom: Math.min(3, ui.viewport.zoom + 0.1) });
    };
    const handleZoomOut = () => {
        setViewport({ ...ui.viewport, zoom: Math.max(0.1, ui.viewport.zoom - 0.1) });
    };
    const handleZoomReset = () => {
        setViewport({ ...ui.viewport, zoom: 1, x: 0, y: 0 });
    };
    // Check if document is empty
    const isEmpty = Object.keys(document.nodes).length === 0;
    if (isEmpty) {
        return (_jsx(CanvasContainer, { ref: canvasRef, children: _jsxs(EmptyState, { children: [_jsx(EmptyStateTitle, { children: "Welcome to JSONIC Editor" }), _jsx(EmptyStateText, { children: "Open a JSON file to start editing, or create a new one with sample data." }), _jsx(EmptyStateButton, { onClick: () => useDocumentStore.getState().createNewDocument(), children: "Create New Document" })] }) }));
    }
    return (_jsxs(CanvasContainer, { ref: canvasRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, style: { cursor: isPanning ? 'grabbing' : 'default' }, children: [_jsxs(SVGCanvas, { children: [_jsx("defs", { children: _jsx("marker", { id: "arrowhead", markerWidth: "10", markerHeight: "7", refX: "9", refY: "3.5", orient: "auto", children: _jsx("polygon", { points: "0 0, 10 3.5, 0 7", fill: ui.theme.connectionStyle.stroke }) }) }), _jsx("g", { transform: getTransform(), children: document.connections.map((connection, index) => {
                            const fromNode = document.nodes[connection.from];
                            const toNode = document.nodes[connection.to];
                            if (!fromNode || !toNode)
                                return null;
                            return (_jsx("line", { x1: fromNode.position.x + fromNode.dimension.width / 2, y1: fromNode.position.y + fromNode.dimension.height, x2: toNode.position.x + toNode.dimension.width / 2, y2: toNode.position.y, stroke: connection.style.stroke, strokeWidth: connection.style.strokeWidth, strokeOpacity: connection.style.opacity, markerEnd: "url(#arrowhead)" }, index));
                        }) })] }), _jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: getTransform(),
                    transformOrigin: '0 0',
                }, children: Object.values(document.nodes).map((node) => (_jsx(Node, { node: node, isSelected: selectedNodes.includes(node.id), isFocused: focusedNode === node.id }, node.id))) }), _jsxs(ZoomControls, { children: [_jsx(ZoomButton, { onClick: handleZoomIn, children: "+" }), _jsxs(ZoomLevel, { children: [Math.round(ui.viewport.zoom * 100), "%"] }), _jsx(ZoomButton, { onClick: handleZoomOut, children: "\u2212" }), _jsx(ZoomButton, { onClick: handleZoomReset, children: "\u27F2" })] })] }));
};
export default Canvas;
