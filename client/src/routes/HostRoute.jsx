import ProtectedRoute from "./ProtectedRoute.jsx";
import HostBooking from "../components/Host/Booking.jsx";
import RoomList from "../components/Host/RoomList.jsx";
import CreateEditRoom from "../components/Host/CreateEditRoom.jsx";
import Room from "../components/common/Room/Room.jsx";

const hostRoutes = [
    {
        index: true,
        path: "/host/rooms",
        element: <ProtectedRoute>
            <RoomList />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/bookings",
        element: <ProtectedRoute>
            <HostBooking />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/add",
        element: <ProtectedRoute>
            <CreateEditRoom />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/edit/:roomId",
        element: <ProtectedRoute>
            <CreateEditRoom />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/view/:roomId",
        element: <ProtectedRoute>
            <Room showReservation={false} />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
];

export default hostRoutes;