import Layout from "../components/Layout/Layout.jsx";
import userRoutes from "./UserRoute.jsx";
import hostRoutes from "./HostRoute.jsx";

// Convert your simple route configs into a data-router format
const createRouteConfig = (routes) =>
  routes.map(({ path, element, index, isSideNav, isHeader }) => ({
    path,
    index,
    element,
    handle: { isSideNav, isHeader },
  }));

// Choose routes based on userType later in AuthContext
const getRoutes = (userType) => {
  const activeRoutes = userType === "host" ? hostRoutes : userRoutes;
  return [
    {
      path: "/",
      element: <Layout />,
      children: createRouteConfig(activeRoutes),
    },
  ];
};

export default getRoutes;