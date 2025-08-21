import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/authentication/AuthContext";

const ProtectedRoute = ({ children, userType }) => {
  const { isLoggedIn, loading, userType: loggedUserType } = useContext(AuthContext);
  if (loading) return null;
  if (isLoggedIn && userType != loggedUserType) {
    return <Navigate to="/404" replace />
  }
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
