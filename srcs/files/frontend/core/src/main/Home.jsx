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
import { useMultiGameContext } from "../contexts/MultiGameContext.jsx";
import './Home.css';

const Home = () => {

	const userinfo = useContext(userContext);
	console.log('HOME userinfo.user', userinfo.user);
	const { setOptions } = useGameContext();
	const { setOptions: setMultiGameOptions } = useMultiGameContext();
    const navigate = useNavigate();
	

		const handleVsVacheClick = () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: userinfo.user.username,
			}));
			navigate('/game');
		};

		const handle2P= () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: userinfo.user.username,
				player_is_ia : 0, 
			}));
			navigate('/game');
		};
		const handleIA_Custom= () => {
			setOptions(prevOptions => ({
				...prevOptions,
				name_p1: userinfo.user.username,
				powerups : 1,
				stage_height : 10,
				stage_width : 15,
				ia_time_between_checks : 60,
				easy_mode : 0,
				texture_p1 : userinfo.user.avatar.replace("/media/", ""),
				texture_p1_ball : "https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg",
				texture_p2 : "princess.jpg"
			}));
			navigate('/game');
		};
		const tournoitest = () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				is_tournament : 1,
				usernames : ["Alaide", "Besouin", "Crame", "Dorothée"],
				avatar : ["https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg", "https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg", "https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg", "https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg"],

			}));
			navigate('/game');
		};
	return (
		<Container fluid className="homeContainer">
			<Row className="mb-3">
				<Col className="columnStyle">
				{/* //TODO texte brut */}

					<Button variant="primary" as={Link} to="/play" className="homeButtons">1V1</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" onClick={handle2P} className="homeButtons">Local 2 Players</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" onClick={handleIA_Custom} className="homeButtons">Local Vs better Ia</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" onClick={tournoitest} className="homeButtons"> Test Tournoi</Button>
				</Col>
				<Col className="columnStyle ">
  					<Button variant="primary" as={Link} to="/multi-options" className="homeButtons">MULTI</Button>
				</Col>
				
				{/* <Col className="columnStyle ">
					
				<Button variant="primary" onClick={MULTI_3P} className="homeButtons">Multi Round Game (3 Players, Double buttons)</Button>
				</Col>
				<Col className="columnStyle ">

				<Button variant="primary" onClick={MULTI_6P} className="homeButtons">Multi Round Game (6 Players, Mono buttons)</Button>
				</Col> */}
				<Col className="columnStyle ">
					
				<Button variant="primary" onClick={handleVsVacheClick} className="homeButtons">Tac Vs Vache</Button>
				</Col>
				<Col className="columnStyle ">
				{/* //TODO texte brut */}

					<Button variant="primary" as={Link} to="/play" className="homeButtons">TOURNAMENT </Button>
				</Col>
			</Row>
		</Container>
	);
}
export default Home;