import { Routes, Route, Link, } from "react-router-dom";
import { useState } from 'react';
import './App.css'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Navbar from './Navbar.jsx'

import Home from './Home';
import Play from './Play.jsx';
import Error404 from './Error404.jsx';
import NavAbout from './NavAbout.jsx';
import Tournament from './tournament.jsx';
import About from './About.jsx';
import Chat from './Chat.jsx';


function App(){

    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLoginClick = () => {
      setShowLoginForm(true);
    };
	return (
		<div className="site">
			<Navbar OnLoginClick={handleLoginClick}/>
			
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

            {showLoginForm && <Login />}
			<Chat />
			<NavAbout />
		</div>
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