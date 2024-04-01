import { Link } from 'react-router-dom';
import  { axiosInstance } from "./axiosAPI.js";
import './Navbar.css';
const Navbar = () => {
	
	async function handleLogout() 
	{
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

	// if (axiosInstance.defaults.headers['Authorization'] === 'JWT null') {
	console.log('NAVBAR RECHARGE');
	
	return ( 
		<nav className="navbar">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="navbar-brand">PONG</Link>
				{variable && content}
			</div>
		</nav>
	);
}
 
export default Navbar;