import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";

const SignUp = ({ showModal, onClose }) => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    if (!modalInstance.current) {
      modalInstance.current = new Modal(modalEl, {
        backdrop: "static",
        keyboard: false,
      });
      modalEl.addEventListener("hidden.bs.modal", onClose);
    }

    showModal ? modalInstance.current.show() : modalInstance.current.hide();

    return () => {
      modalInstance.current?.dispose();
      modalInstance.current = null;
      modalEl.removeEventListener("hidden.bs.modal", onClose);
    };
  }, [showModal, onClose]);

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // TODO: handle backend API call or validation
  };

  return (
    <div className="modal fade" tabIndex="-1" aria-hidden="true" ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sign Up</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <small className="text-danger">
                    {errors.firstName.message}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <small className="text-danger">
                    {errors.lastName.message}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value, formValues) =>
                      value === formValues.password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Verify Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
