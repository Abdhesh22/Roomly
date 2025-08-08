import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const CustomConfirmationModal = ({
    show = false,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onCancel,
    confirmText = "Yes, Confirm",
    cancelText = "Cancel",
}) => {
    const modalRef = useRef(null);
    const bsModal = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    useEffect(() => {
        if (show && bsModal.current) {
            bsModal.current.show();
        } else if (!show && bsModal.current) {
            bsModal.current.hide();
        }
    }, [show]);

    const handleClose = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            data-bs-dismiss="modal"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleConfirm}
                            data-bs-dismiss="modal"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmationModal;
