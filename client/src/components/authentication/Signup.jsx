import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../utils/request/api.util";
import OTPModal from "./Otp";
import { toast } from 'react-toastify';
import { handleCatch } from "../../utils/common";
import MiniCustomModal from "../common/CustomComponent/CustomModal/MiniCustomModal";

const SignUp = ({ showModal, onClose, userType }) => {
  const [optModal, setOtpModal] = useState({
    open: false,
    email: ''
  });

  const { register, handleSubmit, formState: { errors }, getValues, watch, setValue, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      setOtpModal({
        open: true,
        email: data.email
      });
    } catch (error) {
      handleCatch(error);
    }
  };

  const handleOtpSubmit = async (isOtpVerified, message) => {
    try {
      const values = getValues();
      if (isOtpVerified) {
        values.userType = userType;
        const response = await api.post("/api/authentication/register/user", values);
        if (response.data.status) {
          toast.success(response.data.message);
          setOtpModal({
            open: false,
            email: ''
          });
          onClose(true);
        }
      } else {
        toast.error(message);
      }
    } catch (error) {
      handleCatch(error);
    }
  }

  const checkEmailExist = async () => {
    try {
      const email = getValues('email');
      await api.get(`/api/user/check-email/${email}`, { userType });
      return false;
    } catch (error) {
      setValue("email", "");
      handleCatch(error);
      return true;
    }
  }

  useEffect(() => {
    if (showModal) {
      reset();
    }
  }, [showModal]);


  return (
    <>
      <MiniCustomModal show={!optModal.email && showModal} onClose={onClose} title="Sign Up" modalClass="modal-dialog modal-dialog-centered modal-lg" showFooter={false}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName.message}</div>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              onBlur={checkEmailExist}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Verify Email
          </button>
        </form>
      </MiniCustomModal>
      <OTPModal email={optModal.email} showModal={optModal.open} onClose={() => setOtpModal({
        open: false,
        email: ''
      })} onSubmit={handleOtpSubmit} onSendOtp={handleSubmit} />
    </>
  );
};

export default SignUp;
