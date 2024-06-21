import { Form, Button, Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

import './forms.css'

function SignupForm() {
	const { t } = useTranslation();
		const [validated, set_Validated] = useState(false);
		const [form_Data, set_Form_Data] = useState({
			user: "",
			pass: "",
			confimPass: "",
			email: "",
			phoneNo: "",
		});
		const submitFn = (event) => {
			const form = event.currentTarget;
			if (form.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			}
			set_Validated(true);
		};
		const chngFn = (event) => {
			const { name, value } = event.target;
			set_Form_Data({
				...form_Data,
				[name]: value,
			});
		};
		return (
			<Container className="mt-5">
				<Row>
					<Col
						md={{
							span: 6,
							offset: 3,
						}}
					>
						<Form className="" noValidate validated={validated} onSubmit={submitFn}>
							<Form.Group controlId="username">
								<Form.Label>{t('username')}</Form.Label>
								<Form.Control
									type="text"
									name="user"
									value={form_Data.user}
									onChange={chngFn}
									pattern="^[a-zA-Z0-9]+$"
									required
									isInvalid={
										validated &&
										!/^[a-zA-Z0-9]+$/.test(form_Data.user)
									}
								/>
								<Form.Control.Feedback type="invalid">
									{t('valid')}
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
								<Form.Label>{t(email)}</Form.Label>
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
							<Form.Group controlId="phoneNumber">
								<Form.Label>{t('phone')}</Form.Label>
								<Form.Control
									type="number"
									name="phoneNo"
									value={form_Data.phoneNo}
									onChange={chngFn}
									pattern="^\d{10}$"
									required
									isInvalid={
										validated &&
										!/^\d{10}$/.test(form_Data.phoneNo)
									}
								/>
								<Form.Control.Feedback type="invalid">
									{t('invalid_phone')}
								</Form.Control.Feedback>
							</Form.Group>
							<Button type="submit">{t('submit')}</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		);
	};



	function LoginForm() {
		const { t } = useTranslation();
		const [validated, set_Validated] = useState(false);
		const [form_Data, set_Form_Data] = useState({
			user: "",
			pass: "",
		});
		const submitFn = (event) => {
			const form = event.currentTarget;
			if (form.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			}
			set_Validated(true);
			
		};
		const chngFn = (event) => {
			const { name, value } = event.target;
			set_Form_Data({
				...form_Data,
				[name]: value,
			});
		};
		return (
			<Container className="mt-5">
				<Row>
					<Col
						md={{
							span: 6,
							offset: 3,
						}}
					>
						<Form noValidate validated={validated} onSubmit={submitFn}>
							<Form.Group controlId="username">
								<Form.Label>{t('username')}</Form.Label>
								<Form.Control
									type="text"
									name="user"
									value={form_Data.user}
									onChange={chngFn}
									pattern="^[a-zA-Z0-9]+$"
									required
									isInvalid={
										validated &&
										!/^[a-zA-Z0-9]+$/.test(form_Data.user)
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
						
							<Button type='submit' role="button" className="buttonCustom"> {t('login')}</Button>
							{/* <Button type="" className="buttonTest"> Gooo ! </Button> */}
						</Form>
					</Col>
				</Row>
			</Container>
		);
	};





function VerifyForm() {
	const { t } = useTranslation();
		const [code, setCode] = useState("");
		const handleVerify = (event) => {
			event.preventDefault();
			// console.log("Code:", code);
		};
		return (
			<div>
				<h2>{t('enter_code')}</h2>
				<form onSubmit={handleVerify}>
					<div>
						<label htmlFor="code">{t('ccode')}</label>
						<input
							type="text"
							id="code"
							name="code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
						/>
					</div>
					<button type="submit">{t('submit')}</button>
				</form>
			</div>
		);
	}

	export { LoginForm, VerifyForm, SignupForm };