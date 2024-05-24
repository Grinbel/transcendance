import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'; 

import { useContext, useState } from "react";
import { userContext } from "../contexts/userContext.jsx";
import { useGameContext } from "../contexts/GameContext.jsx";

import './Home.css';

const Home = () => {

	const userinfo = useContext(userContext);
	// console.log('Home: userinfo', userinfo.user.userId);
	//print('Home: userinfo', userinfo)
	const { setOptions } = useGameContext();
    const navigate = useNavigate();

	let pop;
	if (userinfo.user === undefined)
		pop="";
	else
		pop = userinfo.user.userId;

		const handleVsVacheClick = () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: "PAPA", // Mettez à jour seulement name_p1
				nombre: 1, 
				couleur: 'rouge' 
			}));
			navigate('/game');
		};
		const handleVsIa = () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: "PAPA", // Mettez à jour seulement name_p1
				nombre: 1, 
				couleur: 'rouge' 
			}));
			navigate('/game');
		};
		const handle2P= () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: userinfo.user.username, // Mettez à jour seulement name_p1
				player_is_ia : 0, 
				couleur: 'rouge' 
			}));
			navigate('/game');
		};
	return (
		<Container fluid className="homeContainer">
			<Row className="mb-3">
				<Col className="columnStyle">
					<Button variant="primary" as={Link} to="/play" className="homeButtons">1V1</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" onClick={handle2P} className="homeButtons">Local 2 Players</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" onClick={handleVsIa} className="homeButtons">Local Vs Ia</Button>
				</Col>
				<Col className="columnStyle ">
					
				<Button variant="primary" onClick={handleVsVacheClick} className="homeButtons">Vs Vache</Button>
				</Col>
				<Col className="columnStyle ">
					<Button variant="primary" as={Link} to="/play" className="homeButtons">TOURNAMENT </Button>
				</Col>
			</Row>
		</Container>
	);
}
export default Home;