import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState , createContext, useContext, useEffect, useMemo, } from 'react';
import { useLocation } from 'react-router-dom';

import Game from './game.jsx'
import MultiGame from './multigame.jsx'
import  { axiosInstance, interceptor_response } from "./axiosAPI.js";


import './App.scss'
import Login from './login/login.jsx'
import Signup from './login/signup.jsx'
import MyNavbar from './navbar/myNavbar.jsx'
import Dashboard from './dashboard/pages/dashboard.jsx'

// import Main from './dashboard/pages/main.jsx';
import History from './dashboard/pages/history.jsx';
import Friends from './dashboard/pages/friends.jsx';
import Settings from './dashboard/pages/settings.jsx';
import MyMain from './dashboard/pages/mymain.jsx';

import Home from './main/Home.jsx';
import Play from './main/Play.jsx';
import Error404 from './main/Error404.jsx';
import Tournament from './main/tournament.jsx';
import About from './main/About.jsx';
import Chat from './main/Chat.jsx';
import Profile from './main/Profile.jsx';
import i18n from './translations/i18n';


import { UserProvider, userContext } from "./contexts/userContext.jsx";
import MultiOptions from './MultiOptions.jsx';



const PrivateRoute = ({ component: Component, user, ...rest }) => (
	<Route
	  {...rest}
	  render={props =>
		user ? (
		  <Component {...props} />
		) : (
		  <Redirect to="/login" />
		)
	  }
	/>
  );

async function getProfile(user, setUser, error, setError){
	// localStorage.removeItem('user');

		console.log('getProfile: no user in local storage');
		console.log(("axios headers token :"), axiosInstance.defaults.headers['Authorization']);
		let userData = {};
		await axiosInstance.get('getprofile/')
			.then((response) => {
				// console.log('app: GETPROFILE response.data', response.data, userData);
				userData =  response.data;
				// console.log('app: GETPROFILE userData', userData);
				return userData;
			})
			.catch((error) => {
				// console.log('axios getprofile failure, catched here in getProfile: ', error.response.status)
				throw error;
			});				// console.log('app: GETPROFILE userData', userData);

		return userData;
}

	// const  appContext = createContext(null);

	function App(){
		
		
		const [user, setUser] = useState();
		const [error, setError] = useState();
		const [loading, setLoading] = useState(true);

		const location = useLocation();
		const navigate = useNavigate();

		// const [loading, setLoading] = useState(true);
		// const userMemo = useMemo(() => {
		// console.log('app: user', user);
		// 	return user;
		//   }, [user]);
		useEffect(() => {
			console.log('app: useEffect user start', user);

			console.log('axiosInstance: baseURL', `${import.meta.env.VITE_API_SERVER_ADDRESS}`);
			
			const fetchUserProfile = async () => {
				try {
					// console.log('app: useEffect tryblock');
					const userData = await getProfile();
					// console.log('app: useEffect getProfile userData', userData);
					setUser(userData);
					i18n.changeLanguage(userData.language);  
					let newuser = { ...userData, isLogged: true };
					setUser(newuser);
					// console.log('app: useEffect getProfile User', user);
					// setLoading(false);
				} catch (error) {
					// setUser(...user, isLogged = false);
					
					setError(error);
					localStorage.removeItem('token');
					localStorage.removeItem('refreshToken');
					if (location.pathname !== '/login' && location.pathname !== '/signup')
					navigate('/login');
				}
				finally {
					setLoading(false);
				}
			};


			const userStringified = localStorage.getItem('user');
			if (userStringified) {
				const userData = JSON.parse(userStringified);
				setUser(userData);
			}
			if (!user) {
				fetchUserProfile();
			  } else {
				setLoading(false);
			  }
		}, []);
		
	useEffect(() => {
		if (user != undefined){
			i18n.changeLanguage(user.language);
			// console.log("USER!!!!!!!!!",user.language);
		}
	}, [user]);
	return (
		<userContext.Provider value={{user, setUser}}>
			<div className="app">
				<MyNavbar/>

				{loading ? (
          			<div>Loading...</div> // You can add a spinner or any loading indicator here
        		) : (
					<Routes>
						<Route path="/dashboard" element={<Dashboard />}>
							<Route index element={<Settings />} />
						</Route>
						<Route path="/multi-options" element={<MultiOptions />} />
						<Route path="/play" element={<Play />} />
						<Route path="/login" element={<Login />} /> 
						<Route path="/signup" element={<Signup />} />
						<Route path="/tournament" element={<Tournament />} />
						<Route path="/about" element={<About />} />
						<Route path="/Game/" element={<Game />} />
						<Route path="/profile" element={<Profile />} />

						<Route path="/profile/:username" element={<Profile />} />
						<Route path="/MultiGame/" element={<MultiGame />} />
						<Route exact path="/" element={<Home />} />
						<Route path="/*" element={<Error404 />} />
					</Routes>
				// {/* <Chat /> */}
				)}
			</div>
		</userContext.Provider>
	);
}

export default App


// async handleLogout() {
//   try {
//       const response = await axiosInstance.post('/blacklist/', {
//           "refresh_token": localStorage.getItem("refresh_token")
//       });
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       axiosInstance.defaults.headers['Authorization'] = null;
//       return response;
//   }
//   catch (e) {
//       console.log(e);
//   }
// };