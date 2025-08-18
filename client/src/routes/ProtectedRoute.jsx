import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/authentication/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  if (loading) return null;
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
