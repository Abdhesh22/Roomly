import { useContext } from "react";
import { AuthContext } from "../authentication/AuthContext";
import { Outlet, useMatches } from "react-router-dom";
import TopNavigation from "../Navigation/TopNavigation/TopNavigation";
import Footer from "./Footer/Footer";
import Sidebar from "../Navigation/Sidebar/Sidebar";

const Layout = () => {

  const { isLoggedIn } = useContext(AuthContext);
  const matches = useMatches();

  const currentPath = matches[matches.length - 1]?.handle;

  const mainContentClass = [
    isLoggedIn && currentPath.isSideNav ? "col-10" : "col-12",
    "p-3",
    "h-100",
    "overflow-auto",
  ].join(" ");

  return (
    <>
      {(!isLoggedIn || currentPath.isHeader) && <TopNavigation />}

      <div className={`main-layout d-flex flex-column ${(!isLoggedIn || currentPath.isHeader) ? 'h-78vh' : 'vh-100'}`}>
        <div className="container-fluid flex-grow-1">
          <div className="row h-100">
            {isLoggedIn && currentPath.isSideNav && (
              <div className="col-2 p-0 border-end h-100">
                <Sidebar />
              </div>
            )}
            <div className={mainContentClass}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      {(!isLoggedIn || currentPath.isHeader) && <Footer />}
    </>
  );
};

export default Layout;