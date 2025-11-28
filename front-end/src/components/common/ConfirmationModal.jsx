import React from 'react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmationModal.css';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    warningText,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel'
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            headerColor="green"
            backgroundColor="green"
            maxWidth="500px"
        >
            <div className="confirmation-content">
                <p className="confirmation-message">{message}</p>
                {warningText && (
                    <p className="confirmation-warning">{warningText}</p>
                )}

                <div className="confirmation-actions">
                    <Button
                        variant="dark"
                        onClick={handleConfirm}
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        variant="dark"
                        onClick={onClose}
                    >
                        {cancelButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;