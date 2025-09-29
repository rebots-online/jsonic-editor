import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDocumentStore, useUIStore } from '@/stores';
import { NodeModel } from '@/utils/NodeModel';

const NodeContainer = styled.div<{
  node: any;
  isSelected: boolean;
  isFocused: boolean;
  theme: any;
}>`
  position: absolute;
  left: ${props => props.node.position.x}px;
  top: ${props => props.node.position.y}px;
  width: ${props => props.node.dimension.width}px;
  height: ${props => props.node.dimension.height}px;
  background-color: ${props => props.node.style.backgroundColor};
  border: ${props => `${props.node.style.borderWidth}px solid ${props.node.style.borderColor}`};
  border-radius: ${props => props.node.style.borderRadius}px;
  color: ${props => props.node.style.color};
  font-size: ${props => props.node.style.fontSize}px;
  font-family: ${props => props.node.style.fontFamily};
  padding: ${props => props.node.style.padding}px;
  margin: ${props => props.node.style.margin}px;
  box-shadow: ${props => props.node.style.shadow};
  opacity: ${props => props.node.style.opacity};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  transform-origin: center;

  ${props => props.isSelected && `
    box-shadow: 0 0 0 3px ${props.theme.colors.accent}, ${props.node.style.shadow};
  `}

  ${props => props.isFocused && `
    box-shadow: 0 0 0 3px ${props.theme.colors.primary}, ${props.node.style.shadow};
  `}

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NodeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  word-break: break-word;
`;

const NodeKey = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 12px;
  opacity: 0.8;
`;

const NodeValue = styled.div`
  font-size: 14px;
  line-height: 1.2;
`;

const NodeType = styled.div`
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ExpandCollapseButton = styled.button`
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.1);
  }
`;

const ChildCountBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`;

interface NodeProps {
  node: any;
  isSelected: boolean;
  isFocused: boolean;
}

const Node: React.FC<NodeProps> = ({ node, isSelected, isFocused }) => {
  const { selectNode, focusNode, deleteNode, expandNode, collapseNode } = useDocumentStore();
  const { showContextMenu } = useUIStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) { // Left click
      event.stopPropagation();

      if (event.detail === 2) { // Double click
        setIsEditing(true);
        setEditValue(NodeModel.getDisplayValue(node));
      } else {
        selectNode(node.id, event.ctrlKey || event.shiftKey);
        focusNode(node.id);

        // Start dragging
        setIsDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    } else if (event.button === 2) { // Right click
      event.preventDefault();
      event.stopPropagation();
      selectNode(node.id, event.ctrlKey || event.shiftKey);
      focusNode(node.id);
      showContextMenu(
        { x: event.clientX, y: event.clientY },
        node.id
      );
    }
  }, [node, selectNode, focusNode, showContextMenu]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;

      useDocumentStore.getState().moveNode(node.id, {
        x: node.position.x + dx,
        y: node.position.y + dy,
      });

      setDragStart({ x: event.clientX, y: event.clientY });
    }
  }, [isDragging, dragStart, node]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [isDragging]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (isFocused) {
          event.preventDefault();
          deleteNode(node.id);
        }
        break;
      case 'F2':
        event.preventDefault();
        setIsEditing(true);
        setEditValue(NodeModel.getDisplayValue(node));
        break;
      case 'Enter':
        if (isEditing) {
          event.preventDefault();
          handleEditSubmit();
        }
        break;
      case 'Escape':
        if (isEditing) {
          event.preventDefault();
          setIsEditing(false);
        }
        break;
    }
  }, [node, isFocused, isEditing, deleteNode]);

  const handleEditSubmit = useCallback(() => {
    if (isEditing) {
      // Parse and update the node value
      try {
        let newValue: any = editValue;

        // Try to parse as JSON if it's a string
        if (node.type === 'string' && editValue.startsWith('"') && editValue.endsWith('"')) {
          newValue = JSON.parse(editValue);
        } else if (node.type === 'number') {
          newValue = parseFloat(editValue);
          if (isNaN(newValue)) newValue = 0;
        } else if (node.type === 'boolean') {
          newValue = editValue.toLowerCase() === 'true';
        } else if (node.type === 'null') {
          newValue = null;
        }

        useDocumentStore.getState().updateNode(node.id, { value: newValue });
        setIsEditing(false);
      } catch (error) {
        // Invalid input, revert to original value
        setEditValue(NodeModel.getDisplayValue(node));
      }
    }
  }, [isEditing, editValue, node]);

  const handleExpandCollapse = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (node.isExpanded) {
      collapseNode(node.id);
    } else {
      expandNode(node.id, true);
    }
  }, [node, expandNode, collapseNode]);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMouseMove, handleMouseUp, handleKeyDown]);

  const displayValue = NodeModel.getDisplayValue(node);
  const nodeTypeLabel = NodeModel.getNodeTypeLabel(node.type);
  const hasChildren = node.children.length > 0;
  const canExpandCollapse = node.type === 'object' || node.type === 'array';

  return (
    <NodeContainer
      node={node}
      isSelected={isSelected}
      isFocused={isFocused}
      theme={useUIStore.getState().ui.theme}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
    >
      <NodeContent>
        {node.key && <NodeKey>{node.key}</NodeKey>}

        {isEditing ? (
          <input
            ref={editRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            style={{
              background: 'transparent',
              border: '1px solid currentColor',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              textAlign: 'center',
              width: '80%',
              outline: 'none',
            }}
          />
        ) : (
          <NodeValue>{displayValue}</NodeValue>
        )}

        <NodeType>{nodeTypeLabel}</NodeType>
      </NodeContent>

      {hasChildren && (
        <ChildCountBadge>
          {node.children.length}
        </ChildCountBadge>
      )}

      {canExpandCollapse && (
        <ExpandCollapseButton
          onClick={handleExpandCollapse}
          title={node.isExpanded ? 'Collapse' : 'Expand'}
        >
          {node.isExpanded ? '−' : '+'}
        </ExpandCollapseButton>
      )}
    </NodeContainer>
  );
};

export default Node;