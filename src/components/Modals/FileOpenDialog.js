import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styled from 'styled-components';
import { useUIStore, useDocumentStore } from '@/stores';
const ModalOverlay = styled.div `
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
const ModalContainer = styled.div `
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;
const ModalHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const ModalTitle = styled.h2 `
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  font-weight: 600;
`;
const CloseButton = styled.button `
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
const FileInput = styled.input `
  display: none;
`;
const DropZone = styled.div `
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
  }

  &.drag-over {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}20;
  }
`;
const DropZoneText = styled.p `
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;
const DropZoneSubtext = styled.p `
  margin: 0;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  font-size: 14px;
`;
const ButtonGroup = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const Button = styled.button `
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.variant === 'primary'
    ? props.theme.colors.primary
    : props.theme.colors.surface};
  color: ${props => props.variant === 'primary'
    ? 'white'
    : props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'primary'
    ? props.theme.colors.primary + 'dd'
    : props.theme.colors.border};
  }
`;
const FileOpenDialog = () => {
    const { hideModal } = useUIStore();
    const [isDragOver, setIsDragOver] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const handleFileSelect = (files) => {
        if (!files || files.length === 0)
            return;
        const file = files[0];
        if (!file.name.endsWith('.json')) {
            alert('Please select a JSON file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                useDocumentStore.getState().loadJSON(content);
                hideModal();
            }
            catch (error) {
                alert(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };
        reader.readAsText(file);
    };
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        handleFileSelect(event.dataTransfer.files);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };
    const handleFileInputChange = (event) => {
        handleFileSelect(event.target.files);
    };
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsx(ModalOverlay, { onClick: hideModal, children: _jsxs(ModalContainer, { onClick: e => e.stopPropagation(), children: [_jsxs(ModalHeader, { children: [_jsx(ModalTitle, { children: "Open JSON File" }), _jsx(CloseButton, { onClick: hideModal, children: "\u00D7" })] }), _jsxs(DropZone, { className: isDragOver ? 'drag-over' : '', onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onClick: handleButtonClick, children: [_jsx(DropZoneText, { children: "Drop your JSON file here or click to browse" }), _jsx(DropZoneSubtext, { children: "Supports .json files" })] }), _jsx(FileInput, { ref: fileInputRef, type: "file", accept: ".json", onChange: handleFileInputChange }), _jsxs(ButtonGroup, { children: [_jsx(Button, { onClick: hideModal, children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: handleButtonClick, children: "Browse Files" })] })] }) }));
};
export default FileOpenDialog;
