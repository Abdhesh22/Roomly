import { useState } from "react";
import SignUp from "./Signup";
const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "coderstone01@gmail.com",
    password: "rajput.abd22@gmail.com",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const closeSignup = () => {
    console.log("Closing");
    setShowModal(false);
  };

  return (
    <>
      <div className="mb-4">
        <h5 className="mb-3">Login to continue</h5>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p>
          Don't have an account?
          <span
            onClick={() => setShowModal(true)}
            className="text-primary ms-1 text-decoration-underline"
            role="button"
          >
            Click here
          </span>
        </p>
      </div>
      <SignUp showModal={showModal} onClose={() => closeSignup()}></SignUp>
    </>
  );
};

export default Login;
