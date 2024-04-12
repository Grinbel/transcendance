import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  
// Composant pour la barre de navigation lorsqu'un utilisateur est connecté
const NavLoggedIn = ({ handleLogout }) => {
	return (
	  <nav>
	  </nav>
	);
  };
  
  // Composant pour la barre de navigation lorsqu'aucun utilisateur n'est connecté
  const NavLoggedOut = ({ handleLogin }) => {
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
				<Nav.Link className='navCustom me-3' href="#features" >Features</Nav.Link>
				<Nav.Link className="navCustom me-3" href="#deets">sign up</Nav.Link>
				<Nav.Link className="navCustom me-3" href="#deets">login</Nav.Link>
				<Nav.Link className="navCustom playButton me-3" href="#deets">play</Nav.Link>

			  </Nav>
			</Navbar.Collapse>
		  </Container>
		</Navbar>
	  );
  };
  
  // Composant principal
  const MyNavbar = ({onLoginClick}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
  
	// Fonction pour gérer la connexion de l'utilisateur
	const handleLogin = () => {
		onLoginClick();
	  // Logique de connexion (par exemple, appel d'une API, vérification des identifiants, etc.)
	  // Ici, nous simulons juste la connexion en modifiant l'état
	  setIsLoggedIn(true);
	};
  
	// Fonction pour gérer la déconnexion de l'utilisateur
	const handleLogout = async () => {
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
	  // Logique de déconnexion (par exemple, suppression des jetons d'authentification, etc.)
	  // Ici, nous simulons juste la déconnexion en modifiant l'état
		setIsLoggedIn(false);
	};
  
	return (
	  <div>
		{isLoggedIn ? (
		  <NavLoggedIn handleLogout={handleLogout} />
		) : (
		  <NavLoggedOut handleLogin={handleLogin} />
		)}
	  </div>
	);
  };
  
  export default MyNavbar;