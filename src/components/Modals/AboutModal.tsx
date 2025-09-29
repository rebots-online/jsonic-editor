import React from 'react';
import styled from 'styled-components';
import { useUIStore } from '@/stores';

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
  padding: 32px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`;

const ModalVersion = styled.div`
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  font-size: 14px;
`;

const ModalContent = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 24px;
`;

const FeatureList = styled.ul`
  text-align: left;
  margin: 16px 0;
  padding-left: 20px;
`;

const FeatureItem = styled.li`
  margin-bottom: 8px;
`;

const Button = styled.button`
  padding: 10px 24px;
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

const AboutModal: React.FC = () => {
  const { hideModal } = useUIStore();

  return (
    <ModalOverlay onClick={hideModal}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>JSONIC Editor</ModalTitle>
          <ModalVersion>Version 1.0.0</ModalVersion>
        </ModalHeader>

        <ModalContent>
          <p>
            A visual JSON editor that presents JSON files as concept maps,
            making it easier to understand and edit complex structures.
          </p>

          <FeatureList>
            <FeatureItem>Visual "thought bubble" interface</FeatureItem>
            <FeatureItem>Keyboard navigation (Tab, Shift+Tab, Ctrl+Arrows)</FeatureItem>
            <FeatureItem>Multiple themes including glassmorphic and brutalist</FeatureItem>
            <FeatureItem>Undo/redo support</FeatureItem>
            <FeatureItem>Real-time validation</FeatureItem>
            <FeatureItem>File operations (Open, Save, Export)</FeatureItem>
          </FeatureList>

          <p>
            <strong>Created by:</strong> Robin L. M. Cheung, MBA<br />
            <strong>License:</strong> All rights reserved
          </p>
        </ModalContent>

        <Button onClick={hideModal}>
          Close
        </Button>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AboutModal;