import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const CustomConfirmationModal = ({
    show = false,
    title = "Are you sure?",
    message = null, // can accept JSX
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    size = "lg", // 👈 new prop (sm, md, lg, xl)
}) => {
    const modalRef = useRef(null);
    const bsModal = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current, {
                backdrop: "static",
                keyboard: false,
            });
        }
    }, []);

    useEffect(() => {
        if (show && bsModal.current) {
            bsModal.current.show();
        } else if (!show && bsModal.current) {
            bsModal.current.hide();
        }
    }, [show]);

    const handleClose = () => onCancel?.();
    const handleConfirm = () => onConfirm?.();

    // ✅ helper to map size prop → bootstrap class
    const getSizeClass = () => {
        switch (size) {
            case "sm": return "modal-sm";
            case "lg": return "modal-lg";
            case "xl": return "modal-xl";
            case "md": return "modal-md";
            default: return "";
        }
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${getSizeClass()}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body">{message}</div>

                    <div className="modal-footer">
                        {cancelText && (
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                {cancelText}
                            </button>
                        )}
                        {confirmText && (
                            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmationModal;
