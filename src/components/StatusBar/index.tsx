import React from 'react';
import styled from 'styled-components';
import { useDocumentStore, useUIStore } from '@/stores';

const StatusBarContainer = styled.div`
  height: 24px;
  background-color: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.monospace};
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.8;
`;

const Separator = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${props => props.theme.colors.border};
`;

const StatusBar: React.FC = () => {
  const { document, canUndo, canRedo } = useDocumentStore();
  const { ui } = useUIStore();

  const nodeCount = Object.keys(document.nodes).length;
  const selectedCount = document.selectedNodes.length;
  const focusedNode = document.focusedNode ? document.nodes[document.focusedNode] : null;

  const getStatusText = () => {
    if (nodeCount === 0) {
      return 'No document loaded';
    }

    const parts = [`${nodeCount} nodes`];

    if (selectedCount > 0) {
      parts.push(`${selectedCount} selected`);
    }

    if (focusedNode) {
      parts.push(`Focused: ${focusedNode.key || focusedNode.type}`);
    }

    return parts.join(', ');
  };

  const getPositionText = () => {
    if (ui.viewport.x === 0 && ui.viewport.y === 0) {
      return 'Origin';
    }

    return `${Math.round(ui.viewport.x)}, ${Math.round(ui.viewport.y)}`;
  };

  return (
    <StatusBarContainer>
      <StatusSection>
        <StatusItem>
          {getStatusText()}
        </StatusItem>

        {canUndo && (
          <>
            <Separator />
            <StatusItem>
              Undo available
            </StatusItem>
          </>
        )}

        {canRedo && (
          <>
            <Separator />
            <StatusItem>
              Redo available
            </StatusItem>
          </>
        )}
      </StatusSection>

      <StatusSection>
        <StatusItem>
          Zoom: {Math.round(ui.viewport.zoom * 100)}%
        </StatusItem>

        <Separator />

        <StatusItem>
          Position: {getPositionText()}
        </StatusItem>

        <Separator />

        <StatusItem>
          {document.name || 'Untitled'}
        </StatusItem>
      </StatusSection>
    </StatusBarContainer>
  );
};

export default StatusBar;