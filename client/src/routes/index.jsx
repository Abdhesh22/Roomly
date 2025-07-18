import Layout from '../components/Layout/Layout.jsx';
import Home from '../components/Home/Home.jsx';
import About from '../components/About/About.jsx';
// import Dashboard from '../pages/Dashboard';
import ContactUs from '../components/ContactUs/ContactUs.jsx';
import Login from '../components/Login/Login.jsx';
import NotFound from '../components/NotFound/NotFound.jsx';
import SignUp from '../components/Signup/Signup.jsx';
import Room from '../components/Room/Room.jsx';
// import ProtectedRoute from './ProtectedRoute.jsx';

const routes = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'about', element: <About /> },
			{ path: 'contact-us', element: <ContactUs /> },
			// {
			//   path: 'dashboard',
			//   element: (
			//     <ProtectedRoute>
			//       <Dashboard />
			//     </ProtectedRoute>
			//   ),
			// },
		],
	},
	{ path: '/room/:id', element: <Room /> },
	{ path: '/login', element: <Login /> },
	{ path: '/signup', element: <SignUp /> },
	{ path: '*', element: <NotFound /> },
];

export default routes;
