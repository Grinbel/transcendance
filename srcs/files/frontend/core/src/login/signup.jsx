import React, { useState, useEffect } from "react";
import axios from "axios";
import  { axiosInstance, interceptor_response } from "../axiosAPI.js";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import '../forms/forms.css'
import { useTranslation } from 'react-i18next';

function Signup() {
	const { t } = useTranslation();
	const [validated, set_validated] = useState(false);
	const [errorMessages, setErrorMessages] = useState("");
	const [successMessage, setSuccessMessage] = useState('');
	const [form_Data, set_Form_Data] = useState({
		username: "",
		pass: "",
		confimPass: "",
		email: "",
	});
	const [userList, setUserList] = useState([]);


	const axiosSignup = axios.create({
		baseURL: `https://${import.meta.env.VITE_API_SERVER_ADDRESS}:8443/users/`,
		timeout: 0,
		headers: {
			'Content-Type': 'application/json',
			'accept': 'application/json'
		},

	  });

	  const updateErrorMessages = (field, messages) => {
		setErrorMessages(prevErrors => ({
			...prevErrors,
			[field]: messages
		}));
	};
	
	const submitFn = async (event) => {
		// i want to eject interceptors here
		axiosSignup.interceptors.response.eject(interceptor_response);
		// console.log("submitFn event currentTarget: ", event.currentTarget);
		const form = event.currentTarget;
		event.preventDefault();
		if (form.checkValidity() === false) {
			// console.log('form.checkValidity() === false');
			event.stopPropagation();
			set_validated(true);
		}
		else {
			// console.log('Form data to submit:', form_Data);
			// signup the user to backend
			// console.log('UserList before duplicate verification', userList);
			// console.log('username before duplicate verification', form_Data.username);
			// if (userList.includes(form_Data.username)) {
			//     setError('Username already exists, try another one');
			//     return;
			// }
			// if (userList.includes(form_Data.email)) {
			//     setError('Email associated with existing account');
			//     return;
			// }
			try {
				const response = await axiosSignup.post('/signup/', {
					username: form_Data.username,
					password: form_Data.pass,
					email: form_Data.email,
				});
				if (response && (response.status === 201)) 
				{
					// console.log('user registred successfully response.data', response.data);
					set_Form_Data({ username: '', email: '', pass: '', confimPass: '' });
					setSuccessMessage('User registered successfully!');
					setErrorMessages({});
				}

			} catch (error) 
			{
				// console.error('Error catched in signup.jsx ', error.response);
				if (error.response) {
					if (error.response.status === 400) {
						//bad request user already exists
						if (error.response.data.username) {
							updateErrorMessages('username', error.response.data.username);
						}
						if (error.response.data.email) {
							updateErrorMessages('email', error.response.data.email);
						}
					}
				} else if (error.request) {
					updateErrorMessages('Network', "NetError");
					console.error('error REQUEST', error.request);
				} else {
					// console.error('error ', error);
					updateErrorMessages('Client', "An unexpected error occurred. Please try again.");
				}
				// throw (error);
			};
		};
	};

	const chngFn = (event) => {
		// console.log('chngFn event.target', event.target);
		const { name, value } = event.target;
		set_Form_Data({
			...form_Data,
			[name]: value,
		});
	};

	useEffect(() => {
		// console.log('////////////// USEEFFECT FUNCTION /////////////');
		const fetchUsersList = async () => {
			try {
				const response = await axiosSignup.get('/list/');
				// console.log('fetch list response.data', response.data);
				setUserList (response.data);
			} catch (error) {
				// console.log('Error fetching users list: ', error.message);
			}
		};

		fetchUsersList();
		// console.log('UserList: ', userList);
	}, []);

	return (
		<Container className="mt-5">
			<Row>
				<Col
					md={{
						span: 6,
						offset: 3,
					}}
				>
				{successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
				{Object.entries(errorMessages).length > 0 && (
					<div style={{ color: 'red' }}>
						{Object.entries(errorMessages).map(([field, message]) => (
							<p key={field}>{t(field)}: {t(message)}</p>
						))}
					</div>
				)}
					<Form className="formCustom" noValidate validated={validated} onSubmit={submitFn}>
						<Form.Group controlId="username">
							<Form.Label>{t('username')}</Form.Label>
							<Form.Control
								type="text"
								name="username"
								value={form_Data.username}
								onChange={chngFn}
								pattern="^[a-zA-Z0-9]+$"
								required
								isInvalid={
									validated &&
									!/^[a-zA-Z0-9]+$/.test(form_Data.username)
								}
							/>
							<Form.Control.Feedback type="invalid">
								{t('valid_user')}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="password">
							<Form.Label>{t('mdp')}</Form.Label>
							<Form.Control
								type="password"
								name="pass"
								value={form_Data.pass}
								onChange={chngFn}
								minLength={6}
								required
								isInvalid={
									validated && form_Data.pass.length < 6
								}
							/>
							<Form.Control.Feedback type="invalid">
								{t('len_error')}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="confirmPassword">
							<Form.Label>{t('confirm')}</Form.Label>
							<Form.Control
								type="password"
								name="confimPass"
								value={form_Data.confimPass}
								onChange={chngFn}
								minLength={6}
								required
								pattern={form_Data.pass}
								isInvalid={
									validated &&
									form_Data.confimPass !== form_Data.pass
								}
							/>
							<Form.Control.Feedback type="invalid">
								{t('nomatch')}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="email">
							<Form.Label>{t('email')}</Form.Label>
							<Form.Control
								type="email"
								name="email"
								value={form_Data.email}
								onChange={chngFn}
								required
								isInvalid={
									validated &&
									!/^\S+@\S+\.\S+$/.test(form_Data.email)
								}
							/>
							<Form.Control.Feedback type="invalid">
								{t('mail_novalid')}
							</Form.Control.Feedback>
						</Form.Group>
						<Button className="buttonCustom" type="submit">{t('submit')}</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default Signup;
