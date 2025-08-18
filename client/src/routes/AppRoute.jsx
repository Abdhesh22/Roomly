import Layout from "../components/Layout/Layout.jsx";
import routes from "./index.jsx"

const createRouteConfig = (routes) => {
  return routes.map(({ path, element, index, isSideNav, isHeader }) => ({
    path,
    index,
    element,
    handle: { isSideNav, isHeader },
  }));
}

const getRoutes = () => {
  return [
    {
      path: "/",
      element: <Layout />,
      children: createRouteConfig(routes),
    },
  ];
};

export default getRoutes;