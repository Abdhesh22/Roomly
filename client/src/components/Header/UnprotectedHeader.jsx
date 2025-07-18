import { NavLink } from 'react-router-dom';

const UnprotectedHeader = () => {
  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <NavLink
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <span className="fs-4">Roomly</span>
        </NavLink>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end // ensures exact match for "/"
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/contact-us"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Contact Us
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/signup"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Sign Up
            </NavLink>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default UnprotectedHeader;
