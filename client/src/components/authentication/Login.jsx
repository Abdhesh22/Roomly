import { useState } from "react";
import SignUp from "./Signup";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../utils/request/api.util";
import { toast } from 'react-toastify';
import { handleCatch } from "../../utils/common";

const Login = ({ onClose, userType }) => {
  const { login } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {

      if (!loginData.email) {
        return toast.error("Email is required");
      }

      if (!loginData.password) {
        return toast.error("Password is required");
      }

      if (loginData.email && loginData.password) {

        const { data } = await api.get('/api/authentication/login', {
          email: loginData.email,
          password: loginData.password,
          userType: userType
        });

        login(data);
        closeLogin(true);
        toast.success(data.message);
      }
    } catch (error) {
      handleCatch(error);
    }
  };


  const closeSignup = () => {
    setShowModal(false);
  };

  const closeLogin = (value) => {
    onClose(value);
  }

  return (
    <>
      <div className="mb-4">
        <h5 className="mb-3">Login to continue</h5>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
        </div>
        <button onClick={() => handleLogin()} className="btn btn-primary w-100">
          Login
        </button>
        <p>
          Don't have an account?
          <span onClick={() => setShowModal(true)} className="text-primary ms-1 text-decoration-underline" role="button"> Click here</span>
        </p>
      </div>
      <SignUp showModal={showModal} onClose={() => closeSignup()} userType={userType}></SignUp>
    </>
  );
};

export default Login;
