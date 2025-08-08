import ProtectedRoute from "./ProtectedRoute.jsx";
import HostBooking from "../components/host/Booking.jsx";
import RoomList from "../components/Host/RoomList/RoomList.jsx";
import CreateEditRoom from "../components/Host/CreateEditRoom/CreateEditRoom.jsx";
import Room from "../components/common/Room/Room.jsx";

const hostRoutes = [
    {
        index: true,
        path: "/host/rooms",
        element: (
            <ProtectedRoute>
                <RoomList />
            </ProtectedRoute>
        ),
        isSideNav: true,
    },
    {
        path: "/host/bookings",
        element: (
            <ProtectedRoute>
                <HostBooking />
            </ProtectedRoute>
        ),
        isSideNav: true,
    },
    {
        path: "/host/rooms/add",
        element: (
            <ProtectedRoute>
                <CreateEditRoom />
            </ProtectedRoute>
        ),
        isSideNav: true,
    },
    {
        path: "/host/rooms/edit/:roomId",
        element: (
            <ProtectedRoute>
                <CreateEditRoom />
            </ProtectedRoute>
        ),
        isSideNav: true,
    },
    {
        path: "/host/rooms/view/:roomId",
        element: (
            <ProtectedRoute>
                <Room showReservation={false} />
            </ProtectedRoute>
        ),
        isSideNav: true,
    },
];

export default hostRoutes;