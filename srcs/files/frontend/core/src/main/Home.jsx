import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	  return (
	<div>
	  <header className="Home">
		<div className="Play-button">
			<Link to="/play" className="nav-item nav-link">PLAY</Link>
		</div>
	  </header>
	</div>
  );
}

export default Home;