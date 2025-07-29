import Layout from "../components/Layout/Layout.jsx";
import Home from "../components/Home/Home.jsx";
import NotFound from "../components/NotFound/NotFound.jsx";
import Room from "../components/Room/Room.jsx";
import Reservation from "../components/Reservation/Reservation.jsx";
import ProtectedRoute from './ProtectedRoute.jsx';
import HostBooking from "../components/host/Booking.jsx";
import HostRoomGrid from "../components/Host/RoomGrid/Room.jsx";
import AddRoom from "../components/Host/AddRoom/AddRoom.jsx";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/room/:id", element: <Room /> },
      { path: "/reservation/:roomid", element: <Reservation /> },
      {
        path: "/host/rooms", element: <ProtectedRoute>
          <HostRoomGrid />
        </ProtectedRoute>
      },
      {
        path: "/host/bookings", element: <ProtectedRoute>
          <HostBooking />
        </ProtectedRoute>
      },
      {
        path: "/host/rooms/add", element: <ProtectedRoute><AddRoom></AddRoom></ProtectedRoute>
      }
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
