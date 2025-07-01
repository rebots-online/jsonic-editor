import React, { useRef } from 'react';
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
  isActive: boolean;
  isExpanded?: boolean;
  level?: number;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Node>) => void;
  onContextMenu: (e: React.MouseEvent, node: Node) => void;
  onDrop: (draggedId: string, targetId: string) => void;
  onToggleExpand?: (id: string) => void;
}

export function JsonNode({
  node,
  isActive,
  isExpanded = true,
  level = 0,
  onSelect,
  onUpdate,
  onContextMenu,
  onDrop,
  onToggleExpand,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
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
      onSelect(node.id);
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
    onSelect(node.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, node);
  };

  const nodeClasses = [
    styles.node,
    isActive ? styles.active : '',
    isDragging ? styles.dragging : '',
    isOver && canDrop ? styles.dropTarget : ''
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
        <span className={styles.nodeValue}>
          {node.type === NodeType.OBJECT && !isExpanded && '{...} '}
          {node.type === NodeType.ARRAY && !isExpanded && '[...] '}
          {node.type === NodeType.STRING && `"${node.value}"`}
          {node.type === NodeType.NUMBER && String(node.value)}
          {node.type === NodeType.BOOLEAN && String(node.value)}
          {node.type === NodeType.NULL && 'null'}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div className={styles.nodeChildren} role="group">
          {node.children?.map((child) => (
            <JsonNode
              key={child.id}
              node={child}
              isActive={false}
              level={level + 1}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onContextMenu={onContextMenu}
              onDrop={onDrop}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
