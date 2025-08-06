import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";

const ConfirmationModal = ({
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

    // Initialize modal once
    useEffect(() => {
        if (modalRef.current && !bsModal.current) {
            bsModal.current = new Modal(modalRef.current, {
                backdrop: "static",
                keyboard: true,
            });

            // Ensure onCancel is called when closed manually
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                onCancel?.();
            });
        }
    }, []);

    // Show/hide modal based on `show`
    useEffect(() => {
        if (!bsModal.current) return;

        if (show) {
            bsModal.current.show();
        } else {
            bsModal.current.hide();
        }
    }, [show]);

    const handleConfirm = () => {
        onConfirm?.();
        bsModal.current?.hide();
    };

    const handleCancel = () => {
        bsModal.current?.hide();
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={handleCancel} />
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleCancel}>
                            {cancelText}
                        </button>
                        <button className="btn btn-danger" onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;