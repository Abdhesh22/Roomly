import { Routes, Route } from 'react-router-dom';
import routes from '.';

const renderRoutes = (routesArray) =>
  routesArray.map(({ path, element, children, index }, i) => (
    <Route key={i} path={path} element={element} index={index}>
      {children && renderRoutes(children)}
    </Route>
  ));

const AppRoutes = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default AppRoutes;
