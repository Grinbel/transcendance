import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

const NavAbout = () => {
	return (
		<div>
		  <header className="NavAbout">
		    <Link to="/about" className="nav-item nav-link">about</Link>
		  </header>
		</div>
	  );
}

export default NavAbout;