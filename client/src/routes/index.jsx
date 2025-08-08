import userRoutes from "./UserRoute";
import hostRoutes from "./HostRoute";

const routes = [
  ...userRoutes,
  {
    path: "/",
    children: [
      ...hostRoutes
    ]
  }
];

export default routes;