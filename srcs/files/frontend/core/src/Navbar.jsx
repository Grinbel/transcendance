import { useState } from 'react';
import { Link } from 'react-router-dom';
import  { axiosInstance } from "./axiosAPI.js";
import './Navbar.css';
import Login from './login.jsx';
  
// Composant pour la barre de navigation lorsqu'un utilisateur est connecté
const NavLoggedIn = ({ handleLogout }) => {
	return (
	  <nav>
		<ul>
		  <li>Accueil</li>
		  <li>Profil</li>
		  <li onClick={handleLogout}>Déconnexion</li>
		</ul>
	  </nav>
	);
  };
  
  // Composant pour la barre de navigation lorsqu'aucun utilisateur n'est connecté
  const NavLoggedOut = ({ handleLogin }) => {
	return (
	  <nav>
		<ul>
		  <li>Accueil</li>
		  <li onClick={handleLogin}>Connexion</li>
		</ul>
	  </nav>
	);
  };
  
  // Composant principal
  const Navbar = ({OnLoginClick}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
  
	// Fonction pour gérer la connexion de l'utilisateur
	const handleLogin = () => {
		OnLoginClick();
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
  
  export default Navbar;