import React, { useState, useContext, forwardRef, useEffect } from 'react';

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
import Image from 'react-bootstrap/Image';

import { userContext } from "../contexts/userContext.jsx";



// Composant pour la barre de navigation lorsqu'un utilisateur est connecté
const NavLoggedIn = () => {
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const userinfo = useContext(userContext);
	const avatar = userinfo.user.avatar ? userinfo.user.avatar : '../../public/yoshi.jpg';
	console.log('avatar', avatar);

	const UserMenu = (
		<Image
		  src={avatar}
		  alt="UserName profile image"
		  roundedCircle
		  style={{ width: '40px' }}
		/>
	)

	const handleLogout = async () => {
		console.log('NavLoggedIn: logout');
		try {
			const response = await axiosInstance.post('/logout/', {
				"refresh_token": localStorage.getItem("refresh_token")
			});
		}
		catch (e) {
			console.log(e);
			if (e.response.status === 400 || e.response.status === 401) {
				setError("Session expired. Please log in again.");
			}
		}
	  // Logique de déconnexion (par exemple, suppression des jetons d'authentification, etc.)
	  // Ici, nous simulons juste la déconnexion en modifiant l'état
	  	localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user');
		axiosInstance.defaults.headers['Authorization'] = null;
		userinfo.setUser();
		console.log('NavLoggedIn: logout successful frontend');
		navigate('/');
	};

	return (
		<Navbar  collapseOnSelect expand="sm" className="bg-body-tertiary">
		  <Container >

			<Navbar.Brand href="#home" className='logoName'>
				Pong
			</Navbar.Brand>
			
			<Nav  className="ms-auto">
				<NavDropdown className='dropCustom' id="nav-dropdown-dark" title={UserMenu}>
									{/* //TODO texte brut */}

					<NavDropdown.Item as={Link} to="/dashboard">profile</NavDropdown.Item>
									{/* //TODO texte brut */}

					<Nav.Link className="navCustom playButton me-3" as={Link} to="/play">play</Nav.Link>
					<NavDropdown.Divider />
									{/* //TODO texte brut */}

					<NavDropdown.Item onClick={handleLogout}>logout</NavDropdown.Item>
            	</NavDropdown>
			</Nav>
		  </Container>
		</Navbar>
	  );
  };
  




  // Composant pour la barre de navigation lorsqu'aucun utilisateur n'est connecté
  const NavLoggedOut = () => {

	const navigate = useNavigate();
	const userinfo = useContext(userContext);

	  return (
		<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbarCustom">
		  <Container>
			<Navbar.Brand as={Link} to="/" className='logoName'>
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
				<Nav.Link className="navCustom me-3" as={Link} to="/signup">sign up</Nav.Link>
				<Nav.Link className="navCustom me-3" as={Link} to="/login" >login</Nav.Link>
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

	if (userinfo.user) {
		console.log('MyNavbar: user logged in');
		console.log('MyNavbar: user', userinfo.user);
	}
	else {
		console.log('MyNavbar: user not logged in');
	}
	// Fonction pour gérer la connexion de l'utilisateur
  
	// Fonction pour gérer la déconnexion de l'utilisateur

  
	return (
	  <div>
		{userinfo.user ? (
		  <NavLoggedIn/>
		) : (
		  <NavLoggedOut/>
		)}
	  </div>
	);
  };
  
  export default MyNavbar;