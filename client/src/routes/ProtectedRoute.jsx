import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/authentication/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  console.log("loading: ", loading);
  if (loading) return null; // or a spinner/loading screen
  console.log("isLoggedIN", isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
