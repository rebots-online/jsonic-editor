import React from 'react';
import styled from 'styled-components';
import { useUIStore } from '@/stores';
import { themes } from '@/themes';

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
  min-width: 500px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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

const PreferencesSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;

const PreferenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PreferenceLabel = styled.label`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const PreferenceControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: 6px 12px;
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

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
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

const ThemePreview = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ThemeOption = styled.div<{ theme: any; isSelected: boolean }>`
  padding: 8px 12px;
  border: 2px solid ${props =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.border
  };
  border-radius: 4px;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PreferencesModal: React.FC = () => {
  const { preferences, updatePreferences, hideModal } = useUIStore();

  const handleThemeChange = (themeId: string) => {
    updatePreferences({ themeId });
  };

  const handleAutoSaveChange = (enabled: boolean) => {
    updatePreferences({ autoSave: enabled });
  };

  const handleAutoSaveIntervalChange = (interval: number) => {
    updatePreferences({ autoSaveInterval: interval });
  };

  const handleTabBehaviorChange = (behavior: 'create-child' | 'navigate-siblings') => {
    updatePreferences({ tabBehavior: behavior });
  };

  return (
    <ModalOverlay onClick={hideModal}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Preferences</ModalTitle>
          <CloseButton onClick={hideModal}>×</CloseButton>
        </ModalHeader>

        <PreferencesSection>
          <SectionTitle>Appearance</SectionTitle>
          <PreferenceItem>
            <PreferenceLabel>Theme</PreferenceLabel>
            <ThemePreview>
              {Object.values(themes).map(theme => (
                <ThemeOption
                  key={theme.id}
                  theme={theme}
                  isSelected={preferences.themeId === theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  {theme.name}
                </ThemeOption>
              ))}
            </ThemePreview>
          </PreferenceItem>
        </PreferencesSection>

        <PreferencesSection>
          <SectionTitle>Editor Behavior</SectionTitle>
          <PreferenceItem>
            <PreferenceLabel>Auto Save</PreferenceLabel>
            <PreferenceControl>
              <Checkbox
                type="checkbox"
                checked={preferences.autoSave}
                onChange={e => handleAutoSaveChange(e.target.checked)}
              />
            </PreferenceControl>
          </PreferenceItem>
          <PreferenceItem>
            <PreferenceLabel>Auto Save Interval (ms)</PreferenceLabel>
            <PreferenceControl>
              <Input
                type="number"
                value={preferences.autoSaveInterval}
                onChange={e => handleAutoSaveIntervalChange(Number(e.target.value))}
                min="1000"
                step="1000"
              />
            </PreferenceControl>
          </PreferenceItem>
          <PreferenceItem>
            <PreferenceLabel>Tab Key Behavior</PreferenceLabel>
            <PreferenceControl>
              <Select
                value={preferences.tabBehavior}
                onChange={e => handleTabBehaviorChange(e.target.value as any)}
              >
                <option value="create-child">Create Child Node</option>
                <option value="navigate-siblings">Navigate Siblings</option>
              </Select>
            </PreferenceControl>
          </PreferenceItem>
        </PreferencesSection>

        <PreferencesSection>
          <SectionTitle>Node Defaults</SectionTitle>
          <PreferenceItem>
            <PreferenceLabel>Default Width</PreferenceLabel>
            <PreferenceControl>
              <Input
                type="number"
                value={preferences.nodeDefaults.width}
                onChange={e => updatePreferences({
                  nodeDefaults: { ...preferences.nodeDefaults, width: Number(e.target.value) }
                })}
                min="50"
                max="300"
              />
            </PreferenceControl>
          </PreferenceItem>
          <PreferenceItem>
            <PreferenceLabel>Default Height</PreferenceLabel>
            <PreferenceControl>
              <Input
                type="number"
                value={preferences.nodeDefaults.height}
                onChange={e => updatePreferences({
                  nodeDefaults: { ...preferences.nodeDefaults, height: Number(e.target.value) }
                })}
                min="30"
                max="200"
              />
            </PreferenceControl>
          </PreferenceItem>
          <PreferenceItem>
            <PreferenceLabel>Font Size</PreferenceLabel>
            <PreferenceControl>
              <Input
                type="number"
                value={preferences.nodeDefaults.fontSize}
                onChange={e => updatePreferences({
                  nodeDefaults: { ...preferences.nodeDefaults, fontSize: Number(e.target.value) }
                })}
                min="8"
                max="24"
              />
            </PreferenceControl>
          </PreferenceItem>
        </PreferencesSection>

        <ButtonGroup>
          <Button onClick={hideModal}>Cancel</Button>
          <Button variant="primary" onClick={hideModal}>
            Save Preferences
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PreferencesModal;