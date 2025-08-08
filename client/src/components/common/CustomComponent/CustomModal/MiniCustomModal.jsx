import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const MiniCustomModal = ({
    title = "Modal Title",
    children,
    show,
    onClose,
    onSubmit,
    showFooter = true,
    showSubmit = true,
    showClose = true,
    submitText = "Submit",
    closeText = "Close",
    footer = null,
}) => {
    const modalRef = useRef(null);
    const modalInstance = useRef(null);

    // Only initialize modal once
    useEffect(() => {
        if (modalRef.current && !modalInstance.current) {
            modalInstance.current = new Modal(modalRef.current, {
                backdrop: "static",
                keyboard: false,
            });
        }
    }, []);

    // Control modal visibility
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
            <div className="modal-dialog modal-dialog-centered modal-sm">
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

                    {/* Handle Custom or Default Footer */}
                    {footer ? (
                        <div className="modal-footer">{footer}</div>
                    ) : (
                        showFooter && (
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
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiniCustomModal;
