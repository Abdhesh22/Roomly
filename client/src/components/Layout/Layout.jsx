import { Outlet } from "react-router-dom";
import TopNavigation from "./TopNavigation/TopNavigation";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Header - fixed */}
      <header className="flex-shrink-0">
        <TopNavigation />
      </header>

      {/* Scrollable main content */}
      <main className="flex-grow-1 overflow-auto">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer - fixed */}
      <footer className="flex-shrink-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;