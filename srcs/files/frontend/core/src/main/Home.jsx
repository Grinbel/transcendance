import React from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'; 
import { useTranslation } from 'react-i18next';



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
	const { t } = useTranslation();

	

		const handleVsVacheClick = () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: userinfo.user.username,
				real_game : 1,
			}));
			navigate('/game');
		};

		const handle2P= () => {
			setOptions(prevOptions => ({
				...prevOptions, // Gardez les options précédentes
				name_p1: userinfo.user.username,
				real_game : 1,
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
				real_game : 1,
				texture_p1 : userinfo.user.avatar.replace("/media/", ""),
				texture_p1_ball : "https://pbs.twimg.com/profile_images/1335272544451112960/YO2w8LHO_400x400.jpg",
				texture_p2 : "princess.jpg"
			}));
			navigate('/game');
		};
		const tournoitest = () => {
			setOptions(prevOptions => ({
				...prevOptions, 
				is_tournament : 1,
				score_to_get : 1, 
        		score_diff : 0,
				real_game : 1,
				usernames : ["Alaide", "Besouin", "Crame", "Dorothée", "Eugène", "Félicie", "Gaston", "Huguette" ],
				//usernames : ["Alaide", "Besouin"],
				//avatar : ["/badboy.png","/players.jpg"],
				avatar : ["/badboy.png","/players.jpg","/princess.jpg","/ponge.jpg","/yoshi.jpg","/xrenoux.jpg","/abelhadi.jpg","/beaudibe.jpg"],

			}));
			navigate('/game');
		};
	return (
		<div>
			{userinfo.user ? (
				<Container fluid className="homeContainer">
					<Row className="mb-3">
						<Col className="columnStyle">
							<Button variant="primary" as={Link} to="/play" className="homeButtons">{t('1V1')}</Button>
						</Col>
						<Col className="columnStyle">
							<Button variant="primary" onClick={handle2P} className="homeButtons">{t('Local 2 Players')}</Button>
						</Col>
						<Col className="columnStyle">
							<Button variant="primary" onClick={handleIA_Custom} className="homeButtons">{t('Local Vs better Ia')}</Button>
						</Col>
						<Col className="columnStyle">
							<Button variant="primary" onClick={tournoitest} className="homeButtons"> {t('Test Tournoi')}</Button>
						</Col>
						<Col className="columnStyle ">
							<Button variant="primary" as={Link} to="/multi-options" className="homeButtons">{t('Multi')}</Button>
						</Col>
						<Col className="columnStyle ">
							
						<Button variant="primary" onClick={handleVsVacheClick} className="homeButtons">{t('Tac vs Vache')}</Button>
						</Col>
						<Col className="columnStyle ">
							<Button variant="primary" as={Link} to="/play" className="homeButtons">{t('TOURNAMENT')}</Button>
						</Col>
					</Row>
				</Container>
			) : (
				<Navigate to='/login'/>
			)};
		</div>
	)
}

export default Home;