import { Link } from 'react-router-dom';
import  { axiosInstance } from "./axiosAPI.js";
import User from './User';
import './Navbar.css';
import { useState } from 'react';

const Navbar = () => {
	const [variable, setVariable] = useState(false);
	async function handleLogout() {
		setVariable(!variable)
		try {
			const response = await axiosInstance.post('/logout/', {
				"refresh_token": localStorage.getItem("refresh_token")
			});
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			axiosInstance.defaults.headers['Authorization'] = null;
			return response;
		}
		catch (e) {
			console.log(e);
		}
	};
	let content = null;
	
	return ( 
		<nav className="navbar">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="navbar-brand">PONG</Link>
				<div className="navbar-nav d-flex">
					{variable && 
						<div className="d-flex flex-column">
						<Link to="/login" className="nav-item nav-link">Login</Link>
						<Link to="/signup" className="nav-item nav-link">Sign-up</Link>

					</div> }
					<button onClick={handleLogout}>Logout</button> 
					{/* //! remove the button up. If someone know why i need to have 2 variable...*/}
					{!variable && 
						<Link to="/user" className="nav-item nav-link">user</Link>
					}{!variable &&
						<button onClick={handleLogout}>Logout</button>
					}
				</div>
			</div>
		</nav>
	);
}
 
export default Navbar;