import React from 'react';
import styled from 'styled-components';
import { useUIStore, useDocumentStore } from '@/stores';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.surface
  };
  color: ${props =>
    props.variant === 'primary'
      ? 'white'
      : props.theme.colors.text
  };
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primary + 'dd'
        : props.theme.colors.border
    };
  }
`;

const FileSaveDialog: React.FC = () => {
  const { hideModal } = useUIStore();
  const { document } = useDocumentStore();
  const [fileName, setFileName] = React.useState(document.name || 'untitled');
  const [fileFormat, setFileFormat] = React.useState<'json' | 'pretty-json'>('json');

  const handleSave = () => {
    try {
      const rootNode = Object.values(document.nodes).find(node => !node.parentId);
      if (!rootNode) {
        alert('No document to save');
        return;
      }

      const jsonString = JSON.stringify(rootNode.value, null, fileFormat === 'pretty-json' ? 2 : 0);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      hideModal();
    } catch (error) {
      alert(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <ModalOverlay onClick={hideModal}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Save JSON File</ModalTitle>
          <CloseButton onClick={hideModal}>×</CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label htmlFor="fileName">File Name</Label>
          <Input
            id="fileName"
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="Enter file name"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="fileFormat">Format</Label>
          <Select
            id="fileFormat"
            value={fileFormat}
            onChange={e => setFileFormat(e.target.value as 'json' | 'pretty-json')}
          >
            <option value="json">Compact JSON</option>
            <option value="pretty-json">Pretty JSON (2-space indentation)</option>
          </Select>
        </FormGroup>

        <ButtonGroup>
          <Button onClick={hideModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            Save File
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FileSaveDialog;