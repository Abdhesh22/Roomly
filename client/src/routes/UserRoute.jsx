import Home from "../components/Home/Home.jsx";
import Room from "../components/common/Room/Room.jsx";
import Reservation from "../components/user/Reservation/Reservation.jsx";
import NotFound from "../components/Navigation/NotFound/NotFound.jsx";

const userRoutes = [
    { index: true, element: <Home />, isSideNav: false, isHeader: true },
    { path: "room/:roomId", element: <Room showReservation={true} />, isSideNav: false, isHeader: true },
    { path: "reservation/:roomid", element: <Reservation />, isSideNav: false, isHeader: true },
    { path: "*", element: <NotFound />, isSideNav: false, isHeader: false }
];

export default userRoutes;