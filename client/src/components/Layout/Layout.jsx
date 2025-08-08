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
  console.log(currentPath);
  // Compute main content class
  const mainContentClass = [
    isLoggedIn && currentPath.isSideNav ? "col-10" : "col-12", // column width
    "p-3",
    "h-100",
    "overflow-auto",
  ].join(" ");

  return (
    <>
      {(!isLoggedIn || currentPath.isHeader) && <TopNavigation />}

      <div className="main-layout d-flex flex-column" style={{ height: "80vh" }}>
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

      {!isLoggedIn && <Footer />}
    </>
  );
};

export default Layout;