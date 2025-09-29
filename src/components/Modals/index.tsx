import React from 'react';
import { useUIStore } from '@/stores';
import PreferencesModal from './PreferencesModal';
import AboutModal from './AboutModal';
import FileOpenDialog from './FileOpenDialog';
import FileSaveDialog from './FileSaveDialog';

const Modals: React.FC = () => {
  const { ui } = useUIStore();

  const renderModal = () => {
    switch (ui.modalType) {
      case 'preferences':
        return <PreferencesModal />;
      case 'about':
        return <AboutModal />;
      case 'file-open':
        return <FileOpenDialog />;
      case 'file-save':
        return <FileSaveDialog />;
      default:
        return null;
    }
  };

  if (!ui.isModalOpen || !ui.modalType) {
    return null;
  }

  return (
    <>
      {renderModal()}
    </>
  );
};

export default Modals;