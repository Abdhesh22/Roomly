import { useState, useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../../authentication/Login";
import MiniCustomModal from "../../common/CustomComponent/CustomModal/MiniCustomModal";
import { AuthContext } from "../../authentication/AuthContext";
import { USER_TYPE } from "../../../utils/constants/user-type.constant";
import SignUp from "../../authentication/Signup";

const TopNavigation = () => {

  const { isLoggedIn, logout, user: loggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const dropdownRef = useRef(null);
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

  const goto = (path) => {
    setDropdownOpen(false);
    navigate(path)
  }

  const signUp = async (userType) => {
    console.log("userType: ", userType);
    setUserType(userType);
    setShowSignup(true);
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
        {loggedUser && (<span className="m-2">{loggedUser.firstName} {loggedUser.lastName}</span>)}
        <div className="dropdown text-end" style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            className="btn btn-light d-flex align-items-center"
            onClick={toggleDropdown}
          >
            {loggedUser?.profileUrl ? (<img
              src={loggedUser?.profileUrl}
              alt="Profile"
              className="rounded-circle"
              width="30"
              height="30"
            />) : (<i className="bi bi-person-circle" style={{ fontSize: "1.2rem" }}></i>)}

          </button>



          {dropdownOpen && (
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2 profile show">
              {!isLoggedIn && (
                <>
                  {/* Login Options */}
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                      onClick={() => login(USER_TYPE.HOST)}
                    >
                      <i className="bi bi-house-door-fill text-primary"></i>
                      <span>Login as Host</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                      onClick={() => login(USER_TYPE.USER)}
                    >
                      <i className="bi bi-person-fill text-success"></i>
                      <span>Login as User</span>
                    </button>
                  </li>

                  {/* Signup Options */}
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                      onClick={() => signUp(USER_TYPE.HOST)}
                    >
                      <i className="bi bi-house-door text-primary"></i>
                      <span>Signup as Host</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                      onClick={() => signUp(USER_TYPE.USER)}
                    >
                      <i className="bi bi-person text-success"></i>
                      <span>Signup as User</span>
                    </button>
                  </li>
                </>
              )}

              {isLoggedIn && (
                <>
                  {loggedUser?.userType == USER_TYPE.USER && (
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                        onClick={() => goto('/user/booking')}
                      >
                        <i className="bi bi-suitcase-fill text-info"></i>
                        <span>My Trips</span>
                      </button>
                    </li>
                  )}

                  {loggedUser?.userType == USER_TYPE.HOST && (
                    <>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                          onClick={() => goto('/host/rooms')}
                        >
                          <i className="bi bi-building text-warning"></i>
                          <span>Rooms</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                          onClick={() => goto('/host/bookings')}
                        >
                          <i className="bi bi-calendar-check text-success"></i>
                          <span>Reservations</span>
                        </button>
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                      onClick={() => goto('/profile')}
                    >
                      <i className="bi bi-person-circle text-primary"></i>
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger rounded-2 py-2"
                      onClick={() => logOut()}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Sign out</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </header>
      <MiniCustomModal show={showLogin && !showSignup} onClose={() => setShowLogin(false)} title="Login" showFooter={false} modalClass="modal-dialog modal-dialog-centered modal-lg">
        <Login userType={userType} onClose={() => setShowLogin(false)} onSignUp={setShowSignup}></Login>
      </MiniCustomModal>
      <SignUp userType={userType} showModal={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
};

export default TopNavigation;
