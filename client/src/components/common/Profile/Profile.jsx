import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../authentication/AuthContext";
import BackButton from "../CustomComponent/BackButton";
import api from "../../../utils/request/api.util";
import { format } from "date-fns";
import { handleCatch } from "../../../utils/common";
import OTPModal from "../../authentication/Otp";
import { toast } from 'react-toastify';

const Profile = () => {
    const { updateUser, user: loggedUser } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [preview, setPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isChangingEmail, setIsChangingEmail] = useState(false);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [showOtpModal, setShowOtpModal] = useState({
        open: false,
        email: null
    });

    // Profile form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: { firstName: "", lastName: "", email: "" }
    });

    // Password form
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, setError: setPasswordFormError, reset: resetPassword, formState: { errors: passwordErrors }, getValues: getPasswordValues } = useForm({
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });

    // Email form
    const { register: registerEmail, handleSubmit: handleEmailSubmit, setValue: setEmailValue, reset: resetEmail, getValues: getEmailValues } = useForm({
        defaultValues: { email: "" }
    });

    // Fetch user profile
    const fetchUser = async () => {
        try {
            const { data } = await api.get("/api/user");
            setUser(data.user);
            setValue("firstName", data.user.firstName);
            setValue("lastName", data.user.lastName);
            setValue("email", data.user.email);
            setEmailValue("email", data.user.email);
            setPreview(data.user?.profileAttachment?.remotePath || "");
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUser(); }, []);

    // Avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
        setError("");
    };

    // Save profile
    const onSubmitProfile = async (data) => {
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            if (avatarFile) formData.append("image", avatarFile);

            const res = await api.putMultipart("/api/user", formData);
            const updatedUser = res.data.user;

            setUser(updatedUser);
            setIsEditing(false);
            setAvatarFile(null);
            setPreview(updatedUser?.profileAttachment?.remotePath || "");
            updateUser({
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                profileUrl: updatedUser?.profileAttachment?.remotePath
            });
        } catch (err) {
            console.error(err);
            setError("Failed to update profile");
        }
    };

    // Change password
    const onSubmitPassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            setPasswordFormError("confirmPassword", { type: "manual", message: "Your confirm password is incorrect" });
            toast.error("Your confirm password is incorrect");
            return;
        }

        try {
            const response = await api.put("/api/user/change-password", { passwordData: data });
            if (response.data.status) {
                resetPassword();
                setIsChangingPassword(false);
            } else {
                toast.error(response.data.message);
                setPasswordFormError("currentPassword", { type: "manual", message: "Current password incorrect" });
            }
        } catch (err) {
            handleCatch(err);
        }
    };


    const checkEmailExist = async () => {
        try {
            const values = getEmailValues();
            await api.get(`/api/user/check-email/${values.email}`, { userType: loggedUser.userType });
            return false;
        } catch (error) {
            setValue("email", "");
            handleCatch(error);
            return true;
        }
    }

    const openOtpModal = async (data) => {
        try {
            const isEmailExist = await checkEmailExist();
            if (!isEmailExist) {
                setShowOtpModal({
                    open: true,
                    email: data.email
                });
            }
        } catch (error) {
            handleCatch(error);
        }
    }

    const onSubmitEmail = async (isOtpVerified, message) => {
        try {
            if (isOtpVerified) {
                toast.success(message);
                const values = getEmailValues();
                const { data: res } = await api.put("/api/user/change-email", values);
                setUser(res.user);
                setIsChangingEmail(false);
                setEmailValue("email", res.user.email);
            }

        } catch (err) {
            handleCatch(err);
        } finally {
            setShowOtpModal(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 room-title">
                <h2 className="mb-0">Profile</h2>
                <BackButton />
            </div>

            <div className="row g-4">
                {/* Profile Card */}
                <div className="col-md-4">
                    <div className="card text-center shadow-sm border-0 rounded-4 p-4 h-100">
                        <div className="position-relative mb-3">
                            <img
                                src={preview || "https://i.pravatar.cc/150?img=5"}
                                alt="Profile"
                                className="rounded-circle border border-3 border-primary shadow mx-auto"
                                width="150"
                                height="150"
                            />
                            {isEditing && (
                                <>
                                    <label htmlFor="avatarUpload" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow" style={{ cursor: "pointer" }}>
                                        <i className="bi bi-camera-fill"></i>
                                    </label>
                                    <input id="avatarUpload" type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
                                </>
                            )}
                        </div>
                        <h4 className="mt-3 mb-1">{user.firstName} {user.lastName}</h4>
                        <p className="text-muted">{user.email}</p>
                        {user.createdOn && (
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2">
                                <i className="bi bi-calendar-check me-1 text-primary"></i> {format(new Date(user.createdOn), "d MMM yyyy")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Forms */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4 h-100">

                        {!isEditing && !isChangingPassword && !isChangingEmail && (
                            <>
                                <h5 className="mb-4 text-primary fw-bold"><i className="bi bi-info-circle me-2"></i> Profile Details</h5>
                                <div className="row gy-3 mb-4">
                                    <div className="col-sm-6"><strong className="text-muted d-block">First Name</strong>{user.firstName}</div>
                                    <div className="col-sm-6"><strong className="text-muted d-block">Last Name</strong>{user.lastName}</div>
                                    <div className="col-sm-6"><strong className="text-muted d-block">Email</strong>{user.email}</div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}><i className="bi bi-pencil-square me-1"></i> Edit Profile</button>
                                    <button className="btn btn-warning" onClick={() => setIsChangingPassword(true)}><i className="bi bi-key-fill me-1"></i> Change Password</button>
                                    <button className="btn btn-info" onClick={() => setIsChangingEmail(true)}><i className="bi bi-envelope-fill me-1"></i> Change Email</button>
                                </div>
                            </>
                        )}

                        {/* Edit Profile Form */}
                        {isEditing && (
                            <form onSubmit={handleSubmit(onSubmitProfile)}>
                                <h5 className="mb-4 text-primary fw-bold"><i className="bi bi-gear-fill me-2"></i> Update Profile</h5>
                                {error && <p className="text-danger small">{error}</p>}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">First Name</label>
                                    <input className="form-control" {...register("firstName", { required: true })} />
                                    {errors.firstName && <span className="text-danger small">First Name is required</span>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Last Name</label>
                                    <input className="form-control" {...register("lastName", { required: true })} />
                                    {errors.lastName && <span className="text-danger small">Last Name is required</span>}
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success"><i className="bi bi-check-circle me-1"></i> Save Changes</button>
                                </div>
                            </form>
                        )}

                        {/* Change Password */}
                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                                <h5 className="mb-4 text-warning fw-bold"><i className="bi bi-shield-lock-fill me-2"></i> Change Password</h5>

                                {["current", "new", "confirm"].map((field, idx) => {
                                    const label = field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm Password";
                                    return (
                                        <div key={idx} className="mb-3 position-relative d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <label className="form-label fw-semibold">{label}</label>
                                                <input
                                                    type={showPassword[field] ? "text" : "password"}
                                                    className={`form-control ${passwordErrors[field + "Password"] ? "is-invalid" : ""}`}
                                                    {...registerPassword(field + "Password", { required: `${label} is required` })}
                                                />
                                                {passwordErrors[field + "Password"] && (
                                                    <div className="text-danger small">{passwordErrors[field + "Password"].message}</div>
                                                )}
                                            </div>
                                            <span
                                                className="ms-3 mt-4"
                                                style={{ cursor: "pointer", userSelect: "none" }}
                                                onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })}
                                            >
                                                <i className={showPassword[field] ? "bi bi-eye-slash fs-5 text-muted" : "bi bi-eye fs-5 text-muted"}></i>
                                            </span>
                                        </div>
                                    );
                                })}


                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => { resetPassword(); setIsChangingPassword(false); }}>Cancel</button>
                                    <button type="submit" className="btn btn-warning"><i className="bi bi-key-fill me-1"></i> Update Password</button>
                                </div>
                            </form>
                        )}

                        {/* Change Email */}
                        {isChangingEmail && (
                            <form onSubmit={handleEmailSubmit(openOtpModal)}>
                                <h5 className="mb-4 text-info fw-bold"><i className="bi bi-envelope-fill me-2"></i> Change Email</h5>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Email</label>
                                    <input type="email" className="form-control" {...registerEmail("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => { resetEmail(); setIsChangingEmail(false); }}>Cancel</button>
                                    <button type="submit" className="btn btn-info"><i className="bi bi-check-circle me-1"></i> Update Email</button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
            <OTPModal showModal={showOtpModal.open} email={showOtpModal.email} onClose={() => setShowOtpModal(false)} onSubmit={onSubmitEmail} />
        </div>
    );
};

export default Profile;