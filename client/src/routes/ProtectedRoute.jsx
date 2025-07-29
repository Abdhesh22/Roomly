import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/authentication/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;