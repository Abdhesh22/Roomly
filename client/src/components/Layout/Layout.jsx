import { useContext } from "react";
import { AuthContext } from "../authentication/AuthContext";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../SideBar/SiderBar";

const Layout = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          {isLoggedIn && (
            <div className="col-2 p-0 border-end">
              <Sidebar />
            </div>
          )}
          <div className={isLoggedIn ? "col-10 p-3" : "col-12 p-3"}>
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Layout;