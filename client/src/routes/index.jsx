import userRoutes from "./UserRoute";
import hostRoutes from "./HostRoute";
import commonRoutes from "./CommonRoute";
const routes = [
  ...userRoutes,
  ...hostRoutes,
  ...commonRoutes
];

export default routes;