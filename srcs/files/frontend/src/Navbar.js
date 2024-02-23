import { Link } from 'react-router-dom';
const Navbar = () => {
	return ( 
		<nav className="navbar">
			<div className="container">
				<Link to="/" className="navbar-brand">PONG</Link>
				<div className="navbar-nav">
					<Link to="/login" className="nav-item nav-link">Login</Link>
					<Link to="/register" className="nav-item nav-link">Register</Link>
				</div>
			</div>
		</nav>
	 );
}
 
export default Navbar;