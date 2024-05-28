import { Routes, Route, Link, } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState , createContext, useContext, useEffect, useMemo, } from 'react';
import { useLocation } from 'react-router-dom';

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

import { UserProvider, userContext } from "./contexts/userContext.jsx";


//todo:
// manage user loging with wrong credentials errors


//make getProfile async function, show me syntax in comment

async function getProfile(user, setUser, error, setError){
	localStorage.removeItem('user');
	const userStringified = localStorage.getItem('user');
	if (userStringified) {
		const userData = JSON.parse(userStringified);
		return (userData);

	} else
	{
		console.log('getProfile: no user in local storage');
		console.log(("axios headers token :"), axiosInstance.defaults.headers['Authorization']);
		let userData = undefined;
		await axiosInstance.get('getprofile/')
			.then((response) => {
				console.log('app: GETPROFILE response.data', response.data, userData);
				userData =  response.data;
				console.log('app: GETPROFILE userData', userData);
				return userData;
			})
			.catch((error) => {
				console.log('axios getprofile failure, catched here in getProfile: ', error.response.status)
				throw error;
			});
		return userData;
	}

}

	// const  appContext = createContext(null);

	function App(){
		
		
		const [user, setUser] = useState();
		const [error, setError] = useState();

		const location = useLocation();
		const navigate = useNavigate();
		// const userMemo = useMemo(() => {
			console.log('app: user', user);
		// 	return user;
		//   }, [user]);

		
		useEffect(() => {
			console.log('app: useEffect user start', user);
			const fetchUserProfile = async () => {
				try {
					console.log('app: useEffect tryblock');
					const userData = await getProfile();
					console.log('app: useEffect getProfile userData', userData);
					setUser(userData);
				} catch (error) {
					setError(error);
					localStorage.removeItem('token');
					localStorage.removeItem('refreshToken');
					if (location.pathname !== '/login' && location.pathname !== '/signup')
					navigate('/login');
			}
			};
	
			fetchUserProfile();
		}, []);

	return (
		<userContext.Provider value={{user, setUser}}>
			<div className="app">
				<MyNavbar/>
					<Routes>
						<Route path="/dashboard" element={<Dashboard />}>
							<Route index element={<MyMain />} />
							<Route path="history" element={<History />} />
							<Route path="friends" element={<Friends />} />
							<Route path="settings" element={<Settings />} />
						</Route>
						<Route path="/play" element={<Play />} />
						<Route path="/login" element={<Login />} /> 
						<Route path="/signup" element={<Signup />} />
						<Route path="/tournament" element={<Tournament />} />
						<Route path="/about" element={<About />} />
						<Route exact path="/" element={<Home />} />
						<Route path="/*" element={<Error404 />} />
					</Routes>

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