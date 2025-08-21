import ProtectedRoute from "./ProtectedRoute.jsx";
import HostBooking from "../components/Host/Booking.jsx";
import RoomList from "../components/Host/RoomList.jsx";
import CreateEditRoom from "../components/Host/CreateEditRoom.jsx";
import Room from "../components/common/Room/Room.jsx";
import { USER_TYPE } from "../utils/constants/user-type.constant.js";

const hostRoutes = [
    {
        index: true,
        path: "/host/rooms",
        element: <ProtectedRoute userType={USER_TYPE.HOST}>
            <RoomList />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/bookings",
        element: <ProtectedRoute userType={USER_TYPE.HOST}>
            <HostBooking />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/add",
        element: <ProtectedRoute userType={USER_TYPE.HOST}>
            <CreateEditRoom />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/edit/:roomId",
        element: <ProtectedRoute userType={USER_TYPE.HOST}>
            <CreateEditRoom />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
    {
        path: "/host/rooms/view/:roomId",
        element: <ProtectedRoute userType={USER_TYPE.HOST}>
            <Room showReservation={false} />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
];

export default hostRoutes;