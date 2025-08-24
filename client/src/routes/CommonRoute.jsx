import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "../components/common/Profile/Profile.jsx";
import Home from "../components/Home/Home.jsx";
const commonRoutes = [
    { index: true, element: <Home />, isSideNav: false, isHeader: true },
    {
        path: "/profile",
        element: <ProtectedRoute>
            <Profile />
        </ProtectedRoute>,
        isSideNav: true,
        isHeader: false
    },
];

export default commonRoutes;