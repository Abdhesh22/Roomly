import AppRoutes from './routes/AppRoute.jsx';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
};

export default App;