import React from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'; 
import { useTranslation } from 'react-i18next';



import { useContext, useState ,useEffect} from "react";
import { userContext } from "../contexts/userContext.jsx";
import { useGameContext } from "../contexts/GameContext.jsx";
import { useMultiGameContext } from "../contexts/MultiGameContext.jsx";
import './Home.css';

const Home = () => {
	const [displayer, setDisplayer] = useState("");
	const userinfo = useContext(userContext);
	const navigate = useNavigate();
	// console.log('HOME userinfo.user', userinfo.user);

	const { setOptions } = useGameContext();
	const { setOptions: setMultiGameOptions } = useMultiGameContext();
	const { t } = useTranslation();

	
	// useEffect(() => {
	// 	console.log('Home: userinfo', userinfo);
	// 	if (!userinfo.user) {
	// 		navigate('/login');
	// 	}
	// }, [userinfo]);
		const handle2P= () => {
			if (userinfo.user === undefined){
				setDisplayer(t("please_login"));
				return;
			}
			const avatar = userinfo.user.avatar ? userinfo.user.avatar.replace("/media", "") : '/yoshi.jpg';
			setDisplayer("");
			setOptions(prevOptions => ({
				...prevOptions, 
				name_p1: userinfo.user.username,
				texture_p1 : avatar,
				real_game : 1,
				player_is_ia : 0,
				name_p2 : 'Peach',
				texture_p2 : "princess.jpg"
			}));
			navigate('/game');
		};
		const handleIA_Custom= () => {
			if (userinfo.user === undefined){
				setDisplayer(t("please_login"));
				return;
			}
			setDisplayer("");
			const avatar = userinfo.user.avatar ? userinfo.user.avatar.replace("/media", "") : '/yoshi.jpg';
			setOptions(prevOptions => ({
				...prevOptions,
				name_p1: userinfo.user.username,
				name_p2 : 'Bowser',
				stage_height : 10,
				stage_width : 15,
				ia_time_between_checks : 60,
				ball_starting_speed: 0.1,
				easy_mode : 0,
				real_game : 1,
				texture_p1 : avatar,
				texture_p2 : "badboy.png"
			}));
			navigate('/game');
		};
	return (
		<div>
			{userinfo.user ? (
				<Container fluid className="homeContainer" style={{height: '89vh'}}>
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
						{/* <Col className="columnStyle">
							<Button variant="primary" onClick={tournoitest} className="homeButtons"> {t('Test Tournoi')}</Button>
						</Col> */}
						<Col className="columnStyle ">
							<Button variant="primary" as={Link} to="/multi-options" className="homeButtons">{t('Multi')}</Button>
						</Col>
						{/* <Col className="columnStyle ">
							
						<Button variant="primary" onClick={handleVsVacheClick} className="homeButtons">{t('Tac vs Vache')}</Button>
						</Col> */}
						{/* <Col className="columnStyle ">
							<Button variant="primary" as={Link} to="/play" className="homeButtons">{t('TOURNAMENT')}</Button>
						</Col> */}
				<div className="displayer-errors">
					{displayer}
				</div>
					</Row>
				</Container>
			) : (
				<Navigate to='/login'/>
			)};
		</div>
	)
}

export default Home;