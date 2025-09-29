import { jsx as _jsx } from "react/jsx-runtime";
import { useDrop } from 'react-dnd';
import styles from './JsonNode.module.css';
export function DropZone({ parentId, index, onDrop }) {
    const [{ isOver }, drop] = useDrop({
        accept: 'NODE',
        drop: (item) => onDrop(item.id, parentId, index),
        collect: monitor => ({ isOver: monitor.isOver() })
    });
    return (_jsx("div", { ref: drop, className: `${styles.dropZone} ${isOver ? styles.dropZoneActive : ''}` }));
}
