import { Routes, Route, Link, } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState , createContext, useContext, useEffect} from 'react';

import Game from './game.jsx'
import  { axiosInstance } from "./axiosAPI.js";


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


function getProfile(user, setUser){

	// decoder le token stocké dans le local.storage

	console.log('getProfile: user', user);
	console.log(("axios headers: token :"), axiosInstance.defaults.headers[
		'Authorization'
	]);
	// ask server to send userinfo
	axiosInstance.get('getprofile/')
	.then((response) => {
		console.log('app: get_profile response', response);
		// userinfo.setUser({username:response.data.username, isLogged:true});
		setUser(response.data);
		setUser({...user, isLogged:true});
	})
	.catch((error) => {
		console.error('There was an error!', error);
	});
}

	// const  appContext = createContext(null);

	function App(){
		
		
		const [user, setUser] = useState(
			{username:"default", 
			token:"" , 
			isLogged:false, 
			two_factor:false, 
			avatar:null}
		);
	
		
		useEffect(() => {
			console.log('MyNavbar: useEffect');
			getProfile(user, setUser);
		}
		, []);


		
    // const handleLoginClick = () => {
	// 	console.log('App: login clicked in navbar');

    //   setShowLoginForm(true);
    // };

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
						<Route path="/Game/" element={<Game />} />
						<Route exact path="/" element={<Home />} />
						{/* <Route path="/*" element={<Error404 />} /> */}
					</Routes>
				{/* {showLoginForm && <Login />} */}
				<Chat />
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