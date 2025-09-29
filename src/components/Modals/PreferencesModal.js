import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { useUIStore } from '@/stores';
import { themes } from '@/themes';
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
  min-width: 500px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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
const PreferencesSection = styled.div `
  margin-bottom: 24px;
`;
const SectionTitle = styled.h3 `
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;
const PreferenceItem = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const PreferenceLabel = styled.label `
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;
const PreferenceControl = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Select = styled.select `
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
const Input = styled.input `
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
const Checkbox = styled.input `
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
const ButtonGroup = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
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
const ThemePreview = styled.div `
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const ThemeOption = styled.div `
  padding: 8px 12px;
  border: 2px solid ${props => props.isSelected
    ? props.theme.colors.primary
    : props.theme.colors.border};
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
const PreferencesModal = () => {
    const { preferences, updatePreferences, hideModal } = useUIStore();
    const handleThemeChange = (themeId) => {
        updatePreferences({ themeId });
    };
    const handleAutoSaveChange = (enabled) => {
        updatePreferences({ autoSave: enabled });
    };
    const handleAutoSaveIntervalChange = (interval) => {
        updatePreferences({ autoSaveInterval: interval });
    };
    const handleTabBehaviorChange = (behavior) => {
        updatePreferences({ tabBehavior: behavior });
    };
    return (_jsx(ModalOverlay, { onClick: hideModal, children: _jsxs(ModalContainer, { onClick: e => e.stopPropagation(), children: [_jsxs(ModalHeader, { children: [_jsx(ModalTitle, { children: "Preferences" }), _jsx(CloseButton, { onClick: hideModal, children: "\u00D7" })] }), _jsxs(PreferencesSection, { children: [_jsx(SectionTitle, { children: "Appearance" }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Theme" }), _jsx(ThemePreview, { children: Object.values(themes).map(theme => (_jsx(ThemeOption, { theme: theme, isSelected: preferences.themeId === theme.id, onClick: () => handleThemeChange(theme.id), children: theme.name }, theme.id))) })] })] }), _jsxs(PreferencesSection, { children: [_jsx(SectionTitle, { children: "Editor Behavior" }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Auto Save" }), _jsx(PreferenceControl, { children: _jsx(Checkbox, { type: "checkbox", checked: preferences.autoSave, onChange: e => handleAutoSaveChange(e.target.checked) }) })] }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Auto Save Interval (ms)" }), _jsx(PreferenceControl, { children: _jsx(Input, { type: "number", value: preferences.autoSaveInterval, onChange: e => handleAutoSaveIntervalChange(Number(e.target.value)), min: "1000", step: "1000" }) })] }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Tab Key Behavior" }), _jsx(PreferenceControl, { children: _jsxs(Select, { value: preferences.tabBehavior, onChange: e => handleTabBehaviorChange(e.target.value), children: [_jsx("option", { value: "create-child", children: "Create Child Node" }), _jsx("option", { value: "navigate-siblings", children: "Navigate Siblings" })] }) })] })] }), _jsxs(PreferencesSection, { children: [_jsx(SectionTitle, { children: "Node Defaults" }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Default Width" }), _jsx(PreferenceControl, { children: _jsx(Input, { type: "number", value: preferences.nodeDefaults.width, onChange: e => updatePreferences({
                                            nodeDefaults: { ...preferences.nodeDefaults, width: Number(e.target.value) }
                                        }), min: "50", max: "300" }) })] }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Default Height" }), _jsx(PreferenceControl, { children: _jsx(Input, { type: "number", value: preferences.nodeDefaults.height, onChange: e => updatePreferences({
                                            nodeDefaults: { ...preferences.nodeDefaults, height: Number(e.target.value) }
                                        }), min: "30", max: "200" }) })] }), _jsxs(PreferenceItem, { children: [_jsx(PreferenceLabel, { children: "Font Size" }), _jsx(PreferenceControl, { children: _jsx(Input, { type: "number", value: preferences.nodeDefaults.fontSize, onChange: e => updatePreferences({
                                            nodeDefaults: { ...preferences.nodeDefaults, fontSize: Number(e.target.value) }
                                        }), min: "8", max: "24" }) })] })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { onClick: hideModal, children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: hideModal, children: "Save Preferences" })] })] }) }));
};
export default PreferencesModal;
