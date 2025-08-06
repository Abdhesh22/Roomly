import { useState } from "react";
import MiniCustomModal from "../../utils/modal/MiniCustomModal";
import { toast } from "react-toastify";

const OTPModal = ({ showModal, onClose, onSubmit }) => {
    const [otp, setOtp] = useState("");

    const handleSubmit = () => {
        if (otp.trim() === "") {
            toast.error("Please Enter OTP")
            return;
        }
        onSubmit(otp);
    };

    return (
        <MiniCustomModal
            show={showModal}
            onClose={onClose}
            title="Enter OTP"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-success" onClick={handleSubmit}>
                        Submit OTP
                    </button>
                </>
            }
        >
            <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
            />
        </MiniCustomModal>
    );
};

export default OTPModal;
