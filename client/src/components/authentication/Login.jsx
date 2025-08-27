import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../utils/request/api.util";
import { toast } from 'react-toastify';
import { handleCatch } from "../../utils/common";
import { USER_TYPE } from "../../utils/constants/user-type.constant";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, userType, title = "Login to continue", onSignUp }) => {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [disableLogin, setDisableLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      setDisableLogin(true);
      const { email, password } = loginData;

      if (!email) return toast.error("Email is required");
      if (!password) return toast.error("Password is required");

      const { data } = await api.post('/api/authentication/login', {
        email,
        password,
        userType
      });
      setDisableLogin(false);
      onClose(true);
      setTimeout(() => {
        if (userType == USER_TYPE.HOST) {
          navigate("/host/rooms")
        }
        login(data);
      }, 100);
      toast.success(data.message || "Login successful");
    } catch (error) {
      setDisableLogin(false);
      handleCatch(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h5 className="mb-3">{title}</h5>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
        </div>

        <button onClick={handleLogin} className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" disabled={disableLogin}>
          {disableLogin ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-3 text-center">
          Don't have an account?
          <span
            onClick={() => onSignUp(true)}
            className="text-primary ms-1 text-decoration-underline"
            role="button"
          >
            Click here
          </span>
        </p>
      </div>
    </>
  );
};

export default Login;