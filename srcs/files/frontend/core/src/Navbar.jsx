import { Link } from 'react-router-dom';
import  { axiosInstance } from "./axiosAPI.js";
import './Navbar.css';
const Navbar = () => {
	async function handleLogout() {
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
	return ( 
		<nav className="navbar">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="navbar-brand">PONG</Link>
				<div className="navbar-nav d-flex">
					<div className="d-flex flex-column">
						<Link to="/login" className="nav-item nav-link">Login</Link>
						<Link to="/signup" className="nav-item nav-link">Sign-up</Link>
					</div>
					<button onClick={handleLogout}>Logout</button>
				</div>
			</div>
		</nav>
	);
}
 
export default Navbar;