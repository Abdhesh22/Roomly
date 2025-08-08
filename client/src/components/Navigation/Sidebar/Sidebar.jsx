import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useContext } from "react";
import { AuthContext } from "../../authentication/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const collapseRef = useRef(null);
    const userName = localStorage.getItem("userName");

    const goto = (path) => {
        navigate(path);
        if (collapseRef.current?.classList.contains("show")) {
            collapseRef.current.classList.remove("show");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="bg-light border-end vh-100 d-flex flex-column">
            {/* TopNavigation */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                <h4 className="mb-0 fw-bold">Roomly</h4>
                <button
                    className="btn btn-outline-secondary d-md-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarCollapse"
                    aria-expanded="false"
                    aria-controls="sidebarCollapse"
                >
                    ☰
                </button>
            </div>

            {/* Menu */}
            <div className="collapse d-md-block flex-grow-1" id="sidebarCollapse" ref={collapseRef}>
                <ul className="nav nav-pills flex-column p-3">
                    <li className="nav-item" onClick={() => goto("/host/rooms")}>
                        <a
                            className={`nav-link ${location.pathname.includes("/host/rooms") ? "active" : "link-dark"}`}
                        >
                            Rooms
                        </a>
                    </li>
                    <li className="nav-item" onClick={() => goto("/host/bookings")}>
                        <a
                            className={`nav-link ${location.pathname === "/host/bookings" ? "active" : "link-dark"}`}
                        >
                            Bookings
                        </a>
                    </li>
                </ul>
            </div>

            {/* User Info & Logout */}
            <div className="p-3 border-top">
                {userName && (
                    <div className="mb-2 text-center text-muted small">
                        Logged in as <br />
                        <strong>{userName}</strong>
                    </div>
                )}
                <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;