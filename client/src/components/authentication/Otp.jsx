import { useState, useEffect } from "react";
import MiniCustomModal from "../common/CustomComponent/CustomModal/MiniCustomModal";
import { toast } from "react-toastify";
import { handleCatch } from "../../utils/common";
import api from "../../utils/request/api.util";

const OTPModal = ({ showModal, onClose, onSubmit, email }) => {
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(30); // 30 sec timer
    const [loading, setLoading] = useState(false);

    // ✅ Submit OTP
    const handleSubmit = async () => {
        try {
            if (otp.trim() === "") {
                toast.error("Please enter OTP");
                return;
            }
            setLoading(true);
            const { data } = await api.post("/api/authentication/verify-otp", { email, otp });
            onSubmit(data.status, data.message);
        } catch (error) {
            handleCatch(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Send OTP API
    const sendOtp = async () => {
        try {
            setLoading(true);
            const { data } = await api.post("/api/authentication/send-otp", { email });
            if (data.status) {
                toast.success(data.message || "OTP sent successfully!");
                setResendTimer(30); // reset timer
            }
        } catch (error) {
            handleCatch(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Auto-send OTP when modal opens
    useEffect(() => {
        if (showModal) {
            sendOtp();
        }
    }, [showModal]);

    // ✅ Countdown effect for resend timer
    useEffect(() => {
        let timer;
        if (showModal && resendTimer > 0) {
            timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer, showModal]);

    return (
        <MiniCustomModal
            show={showModal}
            onClose={onClose}
            title="Verify Your Email"
            modalClass="modal-dialog modal-dialog-centered modal-lg"
            footer={
                <div className="d-flex justify-content-between w-100">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary"
                            onClick={sendOtp}
                            disabled={resendTimer > 0 || loading}
                        >
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Submit OTP"}
                        </button>
                    </div>
                </div>
            }
        >
            <div className="text-center mb-3">
                <p className="text-muted">We’ve sent a 6-digit OTP to your email: <b>{email}</b></p>
            </div>
            <div className="d-flex justify-content-center">
                <input
                    type="text"
                    className="form-control text-center fs-4 fw-bold"
                    style={{ letterSpacing: "8px", width: "200px" }}
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                />
            </div>
        </MiniCustomModal>
    );
};

export default OTPModal;