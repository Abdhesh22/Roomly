import userRoutes from "./UserRoute";
import hostRoutes from "./HostRoute";

const routes = [
  ...userRoutes,
  ...hostRoutes
];

export default routes;