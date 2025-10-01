import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useUIStore } from '@/stores';
import PreferencesModal from './PreferencesModal';
import AboutModal from './AboutModal';
import FileOpenDialog from './FileOpenDialog';
import FileSaveDialog from './FileSaveDialog';
const Modals = () => {
    const { ui } = useUIStore();
    const renderModal = () => {
        switch (ui.modalType) {
            case 'preferences':
                return _jsx(PreferencesModal, {});
            case 'about':
                return _jsx(AboutModal, {});
            case 'file-open':
                return _jsx(FileOpenDialog, {});
            case 'file-save':
                return _jsx(FileSaveDialog, {});
            default:
                return null;
        }
    };
    if (!ui.isModalOpen || !ui.modalType) {
        return null;
    }
    return (_jsx(_Fragment, { children: renderModal() }));
};
export default Modals;
