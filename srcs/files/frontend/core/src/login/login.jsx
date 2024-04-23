import React, { useState, useContext } from "react";
import  { axiosInstance } from "../axiosAPI.js";
import { useNavigate } from 'react-router-dom';
import { userContext } from "../contexts/userContext.jsx";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import '../forms/forms.css'

// import { userContext } from "../contexts/userContext.jsx";

function Login() {
    console.log('Login:');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [validated, set_Validated] = useState(false);


    const [formData, setFormData] = useState({ 
        username: "", 
        password: "" 
    });
    
    const navigate = useNavigate();
    const userInfo = useContext(userContext);

	console.log('Login: user', userInfo.user.username);
    


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log('Login: handleChange event.target.name', event.target.name);
    };


    const handleLogin = async (event) => {

        event.preventDefault();
        console.log('Login: handleLogin formData', formData);
            try 
            {
                const response = await axiosInstance.post('/login/', {
                username: formData.username,
                password: formData.password
                });
                console.log('response.status', response.status);
                if (response.status === 200) 
                {
                    if (response.data.two_factor)
                    {
                        console.log('Login successful 2FA: i go to code page', response);  //SETUP REDIRECT TO HOME PAGE
                        setStep(2);
                    }
                    else
                    {
                        console.log('Login successful no 2FA: i go to home page', response);  //SETUP REDIRECT TO HOME PAGE
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);
                        userInfo.setUser({username:formData.username, isLogged:true});  // passing  info to userContext
                        navigate('/');
                    }
                }
            } catch (error) 
            {
                if (error.response) {
                    console.log('error RESPONSE')
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log('error REQUEST', error.request);
                } else {
                    // quelque chose s’est passé lors de la construction de la requête et cela
                    // a provoqué une erreur
                    console.log('error OBSCURE', error.request);
                }
                setError(error.message);
                throw (error);
            }
    };


    const handleVerify =  async (event) => {
        // alert('A username and password was submitted: ' + formData.username + " " + formData.password);
        event.preventDefault();
        try {
                const response = await axiosInstance.post('/verify/', {
                username: formData.username,
                password: formData.password,
                otp: code
            });
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            userInfo.setUser(formData);  // passing  info to userContext
            setStep(1);
            setFormData({ username: "", password: "" });
            setCode('');

            console.log('Login successful: i go to home page', response);  //SETUP REDIRECT TO HOME PAGE
    
        } catch (error) {
            // console.log('Main Error ', JSON.stringify(error));
            if (error.response) {
                // la requête a été faite et le code de réponse du serveur n’est pas dans
                // la plage 2xx
                console.log('error RESPONSE')
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // la requête a été faite mais aucune réponse n’a été reçue
                // `error.request` est une instance de XMLHttpRequest dans le navigateur
                // et une instance de http.ClientRequest avec node.js
                console.log('error REQUEST', error.request);
            } else {
                // quelque chose s’est passé lors de la construction de la requête et cela
                // a provoqué une erreur
                console.log('error OBSCURE', error.request);
              }
            setError(error.message);
            throw (error);
        }
    };



    return (
        <div>
            {step === 1 ? (
                        <Container className="mt-5">
                            <Row>
                                <Col
                                    md={{
                                        span: 6,
                                        offset: 3,
                                    }}
                                >
                                    <Form noValidate validated={validated} onSubmit={handleLogin}>
                                        <Form.Group controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                pattern="^[a-zA-Z0-9]+$"
                                                required
                                                isInvalid={
                                                    validated &&
                                                    !/^[a-zA-Z0-9]+$/.test(formData.user)
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid username (alphanumeric
                                                characters only).
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                minLength={6}
                                                required
                                                isInvalid={
                                                    validated && formData.pass.length < 6
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Password must be at least 6 characters long.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    
                                        <Button type='submit' role="button" className="buttonCustom"> Login </Button>
                                        {/* <Button type="" className="buttonTest"> Gooo ! </Button> */}
                                    </Form>
                                </Col>
                            </Row>
                        </Container>

                ) : (
                    <Container className="mt-5">
                    <Row>
                        <Col
                            md={{
                                span: 6,
                                offset: 3,
                            }}
                        >
                            <Form noValidate validated={validated} onSubmit={handleVerify}>
                                <Form.Group controlId="verificationCode">
                                    <Form.Label>Verification Code</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="verificationCode"
                                        value={code}
                                        // onChange={handleChange}
                                        maxLength={6}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid verification code.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type='submit' role="button" className="buttonCustom"> Login </Button>
                                    {/* <Button type="" className="buttonTest"> Gooo ! </Button> */}
                            </Form>
                        </Col>
                    </Row>
                </Container>
                    )
            }
        </div>
    );
};

export default Login;
