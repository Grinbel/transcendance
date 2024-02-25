import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import Play from './Play';
import Error404 from './Error404';
// import About from './About';
// import Contact from './Contact';
import login from './Login';
import register from './Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Homepage() {
  return (
	<Router>
		<div className="App">
		<Navbar />
		<header className="Content">
			<Switch>
				<Route path="/play" component={Play} />
				{/* <Route path="/about" component={About} /> */}
				{/* <Route path="/contact" component={Contact} /> */}
				{/* <Route path="/login" component={login} /> */}
				<Route path="/register" component={register} />
				<Route exact path="/" component={Home} />
				{/* <Route component={Error404} /> */}
			</Switch>
		</header>
		</div>
	</Router>
	
  );
}
export default Homepage;