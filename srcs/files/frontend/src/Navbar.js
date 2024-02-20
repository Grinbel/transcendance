const Navbar = () => {
	return ( 
		<nav className="navbar">
			<div className="container">
				<a href="/" className="navbar-brand">Django React</a>
				<div className="navbar-nav">
					<a href="/login" className="nav-item nav-link">Login</a>
					<a href="/register" className="nav-item nav-link">Register</a>
				</div>
			</div>
		</nav>
	 );
}
 
export default Navbar;