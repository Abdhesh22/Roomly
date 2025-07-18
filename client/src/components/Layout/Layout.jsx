import { Outlet, Link } from 'react-router-dom';
import UnprotectedHeader from '../Header/UnprotectedHeader';
import Footer from '../Footer/Footer';


const Layout = () => {
  return (
    <>
      <UnprotectedHeader/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
