import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './JsonNode.module.css';

interface DragItem {
  id: string;
  type: string;
}

interface Props {
  parentId: string;
  index: number;
  onDrop: (draggedId: string, parentId: string, index: number) => void;
}

export function DropZone({ parentId, index, onDrop }: Props) {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean}>({
    accept: 'NODE',
    drop: (item) => onDrop(item.id, parentId, index),
    collect: monitor => ({ isOver: monitor.isOver() })
  });

  return (
    <div ref={drop} className={`${styles.dropZone} ${isOver ? styles.dropZoneActive : ''}`} />
  );
}
