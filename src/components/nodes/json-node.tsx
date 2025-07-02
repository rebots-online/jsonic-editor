import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { JsonNode as Node, NodeType, NodeDropResult } from '../../types/core';
import { getNodeIcon } from '../../utils/node-utils';
import styles from './JsonNode.module.css';

interface DragItem {
  id: string;
  type: string;
  node: Node;
}

interface Props {
  node: Node;
  selectedIds: string[];
  isExpanded?: boolean;
  level?: number;
  onSelect: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
  onUpdate: (id: string, updates: Partial<Node>) => void;
  onContextMenu: (e: React.MouseEvent, node: Node) => void;
  onDrop: (draggedId: string, targetId: string) => void;
  onToggleExpand?: (id: string) => void;
  onAddChild?: (parentId: string, type: NodeType) => void;
}

export function JsonNode({
  node,
  selectedIds,
  isExpanded = true,
  level = 0,
  onSelect,
  onUpdate,
  onContextMenu,
  onDrop,
  onToggleExpand,
  onAddChild,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const [useTextarea, setUseTextarea] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const isActive = selectedIds.includes(node.id);
  const isExpandable = node.type === NodeType.OBJECT || node.type === NodeType.ARRAY;
  const hasChildren = isExpandable && Array.isArray(node.children) && node.children.length > 0;

  const [{ isDragging }, drag] = useDrag<DragItem, NodeDropResult, { isDragging: boolean }>({
    type: 'NODE',
    item: { id: node.id, node, type: 'NODE' },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, NodeDropResult, { isOver: boolean; canDrop: boolean }>({
    accept: 'NODE',
    drop: (item: DragItem) => {
      if (item.id !== node.id) {
        onDrop(item.id, node.id);
      }
      return { draggedId: item.id, targetId: node.id };
    },
    canDrop: (item: DragItem) => item.id !== node.id,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSelect(node.id, e);
    } else if (e.key === 'ArrowRight' && isExpandable && !isExpanded) {
      onToggleExpand?.(node.id);
    } else if (e.key === 'ArrowLeft' && isExpandable && isExpanded) {
      onToggleExpand?.(node.id);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand?.(node.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id, e);
  };

  const handleValueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type !== NodeType.OBJECT && node.type !== NodeType.ARRAY) {
      const current = String(node.value ?? '');
      setEditValue(current);
      if (node.type === NodeType.STRING && (current.length > 30 || current.includes('\n'))) {
        setUseTextarea(true);
      } else {
        setUseTextarea(false);
      }
      setIsEditing(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (node.type === NodeType.BOOLEAN && e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setEditValue(String(e.target.checked));
    } else {
      setEditValue(e.target.value);
    }
  };

  const commitEdit = () => {
    let value: any = editValue;
    if (node.type === NodeType.NUMBER) value = Number(editValue);
    if (node.type === NodeType.BOOLEAN) value = editValue === 'true';
    if (node.type === NodeType.NULL) value = null;
    onUpdate(node.id, { value });
    setIsEditing(false);
  };

  const handleEditKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleEditBlur = () => {
    commitEdit();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, node);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingChild(true);
  };

  const handleSelectAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NodeType;
    if (value && onAddChild) {
      onAddChild(node.id, value);
    }
    setAddingChild(false);
  };

  const cancelAdd = () => setAddingChild(false);

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
  } as React.CSSProperties;

  return (
    <div
      ref={(element) => {
        drag(drop(element));
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      }}
      className={nodeClasses}
      style={style}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="treeitem"
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level + 1}
      aria-selected={isActive}
    >
      <div className={styles.nodeContent}>
        {isExpandable && (
          <span className={styles.expandToggle} onClick={handleToggleExpand}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <span className={styles.nodeIcon}>{getNodeIcon(node.type)}</span>
        {node.key && <span className={styles.nodeKey}>{node.key}:</span>}
        <span className={styles.nodeValue} onClick={handleValueClick}>
          {isEditing ? (
            node.type === NodeType.BOOLEAN ? (
              <input
                type="checkbox"
                autoFocus
                checked={editValue === 'true'}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
              />
            ) : useTextarea ? (
              <textarea
                autoFocus
                value={editValue}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                onKeyDown={handleEditKey}
                rows={Math.min(Math.max(editValue.split('\n').length, 3), 10)}
                className={styles.editField}
              />
            ) : (
              <input
                autoFocus
                value={editValue}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                onKeyDown={handleEditKey}
                className={styles.editField}
              />
            )
          ) : (
            <>
              {node.type === NodeType.OBJECT && !isExpanded && '{...} '}
              {node.type === NodeType.ARRAY && !isExpanded && '[...] '}
              {node.type === NodeType.STRING && `"${node.value}"`}
              {node.type === NodeType.NUMBER && String(node.value)}
              {node.type === NodeType.BOOLEAN && String(node.value)}
              {node.type === NodeType.NULL && 'null'}
            </>
          )}
        </span>
        {isExpandable && (
          addingChild ? (
            <select
              autoFocus
              onBlur={cancelAdd}
              onChange={handleSelectAdd}
              className={styles.addSelect}
            >
              <option value="">add...</option>
              <option value={NodeType.OBJECT}>object</option>
              <option value={NodeType.ARRAY}>array</option>
              <option value={NodeType.STRING}>string</option>
              <option value={NodeType.NUMBER}>number</option>
              <option value={NodeType.BOOLEAN}>boolean</option>
              <option value={NodeType.NULL}>null</option>
            </select>
          ) : (
            <button className={styles.addButton} onClick={handleAddClick}>+</button>
          )
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className={styles.nodeChildren} role="group">
          {node.children?.map((child) => (
            <JsonNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              level={level + 1}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onContextMenu={onContextMenu}
              onDrop={onDrop}
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
