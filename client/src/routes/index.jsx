import Layout from "../components/Layout/Layout.jsx";
import Home from "../components/Home/Home.jsx";
import NotFound from "../components/NotFound/NotFound.jsx";
import Room from "../components/Room/Room.jsx";
import Reservation from "../components/Reservation/Reservation.jsx";
import ProtectedRoute from './ProtectedRoute.jsx';
import HostBooking from "../components/host/Booking.jsx";
import RoomList from "../components/Host/RoomList/RoomList.jsx";
import CreateEditRoom from "../components/Host/CreateEditRoom/CreateEditRoom.jsx";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/room/:roomId", element: <Room showReservation={true} /> },
      { path: "/reservation/:roomid", element: <Reservation /> },
      {
        path: "/host/rooms", element: <ProtectedRoute>
          <RoomList />
        </ProtectedRoute>
      },
      {
        path: "/host/bookings", element: <ProtectedRoute>
          <HostBooking />
        </ProtectedRoute>
      },
      {
        path: "/host/rooms/add", element: <ProtectedRoute><CreateEditRoom></CreateEditRoom></ProtectedRoute>
      },
      {
        path: "/host/rooms/edit/:roomId", element: <ProtectedRoute><CreateEditRoom></CreateEditRoom></ProtectedRoute>
      },
      {
        path: "host/rooms/view/:roomId", element: <ProtectedRoute><Room showReservation={false}></Room></ProtectedRoute>
      }
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
