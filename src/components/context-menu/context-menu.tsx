import React, { useEffect } from 'react';
import { JsonNode } from '../../types/core';

interface MenuItem {
  label: string;
  action: string;
}

interface Props {
  node: JsonNode;
  position: { x: number; y: number };
  onAction: (action: string) => void;
}

export function ContextMenu({ node, position, onAction }: Props) {
  useEffect(() => {
    const handle = () => onAction('close');
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [onAction]);

  const items: MenuItem[] = [{ label: 'Delete', action: 'delete' }];

  return (
    <ul className="context-menu" style={{ top: position.y, left: position.x }}>
      {items.map(i => (
        <li key={i.action} onClick={() => onAction(i.action)}>{i.label}</li>
      ))}
    </ul>
  );
}
