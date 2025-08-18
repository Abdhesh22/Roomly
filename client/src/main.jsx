import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/style/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/authentication/AuthContext";
import getRoutes from "./routes/AppRoute.jsx";
import { useContext } from "react";

function RouterWrapper() {
  const { userType, loading } = useContext(AuthContext);
  if (loading) return null;
  const router = createBrowserRouter(getRoutes(userType));
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterWrapper />
    </AuthProvider>
  </React.StrictMode>
);