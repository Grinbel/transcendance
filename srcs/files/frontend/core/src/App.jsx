import { Routes, Route, Link, } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState , createContext, useContext} from 'react';

import './App.css'
import Login from './login/login.jsx'
import Signup from './login/signup.jsx'
import MyNavbar from './navbar/myNavbar.jsx'

import Home from './main/Home.jsx';
import Play from './main/Play.jsx';
import Error404 from './main/Error404.jsx';
import Tournament from './main/tournament.jsx';
import About from './main/About.jsx';
import Chat from './main/Chat.jsx';

import { UserProvider, userContext } from "./contexts/userContext.jsx";

const  appContext = createContext(null);

function App(){


    // const handleLoginClick = () => {
	// 	console.log('App: login clicked in navbar');

    //   setShowLoginForm(true);
    // };

	return (
		<UserProvider>
			<div className="site">
				<MyNavbar/>
				
				<main>
					<Routes>
						<Route path="/play" element={<Play />} />
						<Route path="/login" element={<Login />} /> 
						<Route path="/signup" element={<Signup />} />
						<Route path="/tournament" element={<Tournament />} />
						<Route path="/about" element={<About />} />
						<Route exact path="/" element={<Home />} />
						<Route path="/*" element={<Error404 />} />
					</Routes>
				</main>
				{/* {showLoginForm && <Login />} */}
				<Chat />
			</div>
		</UserProvider>
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