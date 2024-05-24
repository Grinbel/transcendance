import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'; 

import { useContext, useState } from "react";
import { userContext } from "../contexts/userContext.jsx";

import './Home.css';

const Home = () => {

	const userinfo = useContext(userContext);
	// console.log('Home: userinfo', userinfo.user.userId);
	//print('Home: userinfo', userinfo)
	let pop;
	if (userinfo.user === undefined)
		pop="";
	else
		pop = userinfo.user.userId;

	return (
		<Container fluid className="homeContainer">
			<Row className="mb-3">
				<Col className="columnStyle">
					<Button variant="primary" as={Link} to="/play" className="homeButtons">1V1</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" as={Link} to="/local" className="homeButtons">Local 2 Players</Button>
				</Col>
				<Col className="columnStyle">
					<Button variant="primary" as={Link} to="/localIA" className="homeButtons">Local Vs Ia</Button>
				</Col>
				<Col className="columnStyle ">
					
					<Button variant="primary" as={Link} to={`/game?value=${pop + '+' + 0}`} className="homeButtons"> Vs Vache </Button>
				</Col>
				<Col className="columnStyle ">
					<Button variant="primary" as={Link} to="/play" className="homeButtons">TOURNAMENT </Button>
				</Col>
			</Row>
		</Container>
	);
}
export default Home;