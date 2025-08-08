import { useState, useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../../authentication/Login";
import MiniCustomModal from "../../common/CustomComponent/CustomModal/MiniCustomModal";
import { AuthContext } from "../../authentication/AuthContext";
import { USER_TYPE } from "../../../utils/constants/user-type.constant";

const TopNavigation = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const dropdownRef = useRef(null);

  const userName = localStorage.getItem("userName");
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const login = (userType) => {
    setUserType(userType);
    setShowLogin(true);
  }

  const logOut = () => {
    toggleDropdown();
    logout();
    navigate("/")
  }

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-between align-items-center py-3 mb-4 border-bottom">
        <NavLink
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <span className="fs-4">Roomly</span>
        </NavLink>
        {userName && (<span className="m-2">{userName}</span>)}
        <div className="dropdown text-end" style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            className="btn btn-light d-flex align-items-center"
            onClick={toggleDropdown}
          >
            <i className="bi bi-person-circle" style={{ fontSize: "1.2rem" }}></i>
          </button>

          {dropdownOpen && (
            <ul className="dropdown-menu text-small show profile" >
              {!isLoggedIn && (<>
                <li>
                  <button className="dropdown-item" onClick={() => login(USER_TYPE.HOST)}>Login As Host</button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => login(USER_TYPE.USER)}>Login As User</button>
                </li>
              </>)}
              {isLoggedIn && (<li>
                <button className="dropdown-item" onClick={() => logOut()}>Sign out</button>
              </li>)}
            </ul>
          )}
        </div>
      </header>
      <MiniCustomModal show={showLogin} onClose={() => setShowLogin(false)} title="Login" showFooter={false}>
        <Login userType={userType} onClose={() => setShowLogin(false)}></Login>
      </MiniCustomModal>
    </div>
  );
};

export default TopNavigation;
