import { useState, useContext } from 'react';
import { Link,  useNavigate} from 'react-router-dom';

import './myNavbar.css';

import  { axiosInstance } from "../axiosAPI.js";
import Login from '../login/login.jsx';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { userContext } from "../contexts/userContext.jsx";




// And if we want to pass the data along with navigation

// Sending component->

// import {useNavigate} from 'react-router-dom';

// ...

// const navigate = useNavigate();

// const toComponentB=()=>{
//    navigate('/componentB', {state: {id:1, name:'kunal'}});
// }

// Receiving component->

// import {useLocation} from 'react-router-dom';

// ...

// const location = useLocation();

// return (
//           <div>{location.state.name}</div>
//        )


  
// Composant pour la barre de navigation lorsqu'un utilisateur est connecté
const NavLoggedIn = () => {
	const navigate = useNavigate();
	const userinfo = useContext(userContext);
	const handleLogout = async () => {
		console.log('NavLoggedIn: logout');
		try {
			const response = await axiosInstance.post('/logout/', {
				"refresh_token": localStorage.getItem("refresh_token")
			});
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			axiosInstance.defaults.headers['Authorization'] = null;
		}
		catch (e) {
			console.log(e);
		}
	  // Logique de déconnexion (par exemple, suppression des jetons d'authentification, etc.)
	  // Ici, nous simulons juste la déconnexion en modifiant l'état
		userinfo.setUser({username:"", isLogged:false});
		console.log('NavLoggedIn: logout successful frontend');
		navigate('/');
	};

	return (
		<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
		  <Container>

			<Navbar.Brand href="#home" className='logoName'>
				<img
					src="../src/assets/pong.png" // Replace with the path to your logo
					width="50"
					height="50"
					className="d-inline-block align-top me-2"
					alt="Pong"
				/>
				Pong
			</Navbar.Brand>

			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">

			  <Nav  className="ms-auto">
				<Nav.Link as='Link' className="navCustom playButton me-3" to="/deets">play</Nav.Link>
				<Nav.Link as='Link' className='navCustom me-3' to="/profile">Profile</Nav.Link>
				<Button className="buttonCustom" onClick={handleLogout}>Logout</Button>
			  </Nav>

			</Navbar.Collapse>
		  </Container>
		</Navbar>
	  );
  };
  




  // Composant pour la barre de navigation lorsqu'aucun utilisateur n'est connecté
  const NavLoggedOut = () => {

	const navigate = useNavigate();
	const userinfo = useContext(userContext);

	  return (
		<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
		  <Container>
			<Navbar.Brand href="/" className='logoName'>
				{/* <img
					// src="../src/assets/pong.png" // Replace with the path to your logo
					width="50"
					height="50"
					className="d-inline-block align-top me-2"
					// alt="Pong"
				/> */}
				Pong
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
			  <Nav  className="ms-auto navbarCustom">
				<Nav.Link className="navCustom me-3" href="/signup">sign up</Nav.Link>
				<Nav.Link className="navCustom me-3" href='/login' >login</Nav.Link>
				<Nav.Link className="navCustom playButton me-3" href="/play">play</Nav.Link>
			  </Nav>
			</Navbar.Collapse>
		  </Container>
		</Navbar>
	  );
  };
  
  // Composant principal
  const MyNavbar = () => {
	const navigate = useNavigate();
	const userinfo = useContext(userContext);

	console.log('MyNavbar: userinfo', userinfo);
	
	// Fonction pour gérer la connexion de l'utilisateur
  
	// Fonction pour gérer la déconnexion de l'utilisateur

  
	return (
	  <div>
		{userinfo.user.isLogged ? (
		  <NavLoggedIn/>
		) : (
		  <NavLoggedOut/>
		)}
	  </div>
	);
  };
  
  export default MyNavbar;