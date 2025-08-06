import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const goto = (path) => {
        navigate(path);
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end vh-100">
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item" onClick={() => goto("/host/rooms")}>
                    <a className={`nav-link ${location.pathname.includes('/host/rooms') ? "active" : "link-dark"}`}>
                        Rooms
                    </a>
                </li>
                <li className="nav-item" onClick={() => goto("/host/bookings")}>
                    <a className={`nav-link ${location.pathname === "/host/bookings" ? "active" : "link-dark"}`}>
                        Bookings
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;