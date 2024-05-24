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
	console.log('Home: userinfo', userinfo);

	return (
		<Container fluid className="homeContainer">
			<Row className="mb-3">
				<Col className="columnStyle">
				{/* //TODO texte brut */}

					<Button variant="primary" as={Link} to="/play" className="homeButtons">1V1</Button>
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