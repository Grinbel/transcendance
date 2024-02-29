import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import Play from './Play';
import Error404 from './Error404';
import NavAbout from './NavAbout';
// import Contact from './Contact';
import one_v_one from './one_v_one';
import login from './Login';
import register from './Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import tournament from './tournament';
import About from './About';
import Chat from './Chat';

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
				<Route path="/login" component={login} />
				<Route path="/register" component={register} />
				<Route path="/1v1" component={one_v_one} />
				<Route path="/tournament" component={tournament} />
				<Route path="/about" component={About} />
				<Route exact path="/" component={Home} />
				<Route component={Error404} />
			</Switch>
		<Chat />
		<NavAbout />
		</header>
		</div>
	</Router>
	
  );
}
export default Homepage;