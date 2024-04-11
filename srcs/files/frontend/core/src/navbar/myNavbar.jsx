import { useState } from 'react';
import { Link } from 'react-router-dom';
import  { axiosInstance } from "../axiosAPI.js";
import Login from '../login/login.jsx';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
  
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
		<Navbar expand="lg" className="bg-body-tertiary">
		  <Container>
			<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			  <Nav className="me-auto">
				<Nav.Link href="#home">Home</Nav.Link>
				<Nav.Link href="#link">Link</Nav.Link>
				<NavDropdown title="Dropdown" id="basic-nav-dropdown">
				  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
				  <NavDropdown.Item href="#action/3.2">
					Another action
				  </NavDropdown.Item>
				  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
				  <NavDropdown.Divider />
				  <NavDropdown.Item href="#action/3.4">
					Separated link
				  </NavDropdown.Item>
				</NavDropdown>
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