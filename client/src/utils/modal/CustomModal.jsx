import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";

const CustomModal = ({
    title = "Modal Title",
    children,
    show,
    onClose,
    onSubmit,
    submitText = "Submit",
    closeText = "Close",
    showSubmit = false,
    showClose = false,
}) => {
    const modalRef = useRef(null);
    const modalInstance = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new Modal(modalRef.current, {
                backdrop: "static",
                keyboard: false,
            });
            if (show) {
                modalInstance.current.show();
            }
        }
    }, []);

    useEffect(() => {
        if (modalInstance.current) {
            show ? modalInstance.current.show() : modalInstance.current.hide();
        }
    }, [show]);

    const handleClose = () => {
        modalInstance.current?.hide();
        onClose?.();
    };

    const handleSubmit = () => {
        onSubmit?.();
        modalInstance.current?.hide();
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        {showClose && (
                            <button className="btn btn-secondary" onClick={handleClose}>
                                {closeText}
                            </button>
                        )}
                        {showSubmit && (
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {submitText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;