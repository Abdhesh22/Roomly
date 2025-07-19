import Layout from "../components/Layout/Layout.jsx";
import Home from "../components/Home/Home.jsx";
import NotFound from "../components/NotFound/NotFound.jsx";
import Room from "../components/Room/Room.jsx";
import Checkout from "../components/Checkout/Checkout.jsx";
// import ProtectedRoute from './ProtectedRoute.jsx';

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // {
      //   path: 'dashboard',
      //   element: (
      //     <ProtectedRoute>
      //       <Dashboard />
      //     </ProtectedRoute>
      //   ),
      // },
      { path: "/room/:id", element: <Room /> },
      { path: "/checkout/:roomid", element: <Checkout /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
