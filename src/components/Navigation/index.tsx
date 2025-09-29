import React, { useState } from 'react';
import styled from 'styled-components';
import { useDocumentStore, useUIStore } from '@/stores';

const NavigationBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }

  &:active {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.primary};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }

  &:active {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  ${props => props.theme.type === 'dark' && `
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const MenuSeparator = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 4px 0;
`;

const Shortcut = styled.span`
  margin-left: auto;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  font-size: 12px;
  font-family: ${props => props.theme.fonts.monospace};
`;

const Logo = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-right: 32px;
`;

interface NavigationProps {
  onFileOpen: (event: Event) => void;
  onFileSave: () => void;
  onNewDocument: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onFileOpen,
  onFileSave,
  onNewDocument,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { showModal } = useUIStore();

  const menuItems = {
    file: [
      { label: 'New', shortcut: 'Ctrl+N', action: onNewDocument },
      { label: 'Open...', shortcut: 'Ctrl+O', action: onFileOpen },
      { label: 'Save', shortcut: 'Ctrl+S', action: onFileSave },
      { label: 'Save As...', action: () => console.log('Save As') },
      { type: 'separator' },
      { label: 'Export', action: () => console.log('Export') },
    ],
    edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => useDocumentStore.getState().undo() },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: () => useDocumentStore.getState().redo() },
      { type: 'separator' },
      { label: 'Delete', shortcut: 'Del', action: () => console.log('Delete') },
      { type: 'separator' },
      { label: 'Preferences', action: () => showModal('preferences') },
    ],
    view: [
      { label: 'Zoom In', shortcut: 'Ctrl++', action: () => console.log('Zoom In') },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => console.log('Zoom Out') },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: () => console.log('Reset Zoom') },
      { type: 'separator' },
      { label: 'Auto Layout', shortcut: 'Ctrl+L', action: () => useDocumentStore.getState().autoLayout('vertical') },
      { label: 'Expand All', action: () => useDocumentStore.getState().expandAll() },
      { label: 'Collapse All', action: () => useDocumentStore.getState().collapseAll() },
    ],
    help: [
      { label: 'Documentation', action: () => console.log('Documentation') },
      { label: 'About', action: () => showModal('about') },
    ],
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (activeMenu && !(event.target as Element).closest('.menu-container')) {
      setActiveMenu(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  return (
    <NavigationBar>
      <MenuSection>
        <Logo>JSONIC Editor</Logo>
        {Object.entries(menuItems).map(([menuName, items]) => (
          <div key={menuName} className="menu-container" style={{ position: 'relative' }}>
            <MenuButton onClick={() => handleMenuClick(menuName)}>
              {menuName.charAt(0).toUpperCase() + menuName.slice(1)}
            </MenuButton>
            <DropdownMenu isOpen={activeMenu === menuName}>
              {items.map((item, index) =>
                item.type === 'separator' ? (
                  <MenuSeparator key={index} />
                ) : (
                  <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(item.action)}
                  >
                    {item.label}
                    {item.shortcut && <Shortcut>{item.shortcut}</Shortcut>}
                  </MenuItem>
                )
              )}
            </DropdownMenu>
          </div>
        ))}
      </MenuSection>

      <MenuSection>
        <MenuButton onClick={() => useUIStore.getState().showModal('about')}>
          About
        </MenuButton>
      </MenuSection>
    </NavigationBar>
  );
};

export default Navigation;