import React, { useState, useContext, useEffect } from "react";
import  { axiosInstance, loginInstance } from "../axiosAPI.js";
import { useNavigate } from 'react-router-dom';
import { userContext } from "../contexts/userContext.jsx";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import '../forms/forms.css'
import { useTranslation } from 'react-i18next';

import { jwtDecode } from "jwt-decode";


// import { userContext } from "../contexts/userContext.jsx";
async function getUuid(userInfo){
	const response = await axiosInstance.get('/api/', {
		// id:userInfo.user.id,
		id:"34",
		});
	const Uuid = response.uuid;
	userInfo.setUser({
		...userInfo.user,
		id:Uuid,
	  });
	//   console.log(userInfo.user.id);
}

function Login() {
    const { t } = useTranslation();
    // console.log('Login:');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [validated, set_validated] = useState(false);
    const [loggedinMessage, setLoggedinMessage] = useState('');


    const [formData, setFormData] = useState({ 
        username: "", 
        password: "" 
    });
    
    const navigate = useNavigate();
    const userInfo = useContext(userContext);
    
    useEffect(() => {
        if (userInfo.user) {
            // console.log('Login: user ', userInfo.user.username);
            setLoggedinMessage(t('logged'));
        }
    }, [userInfo.user]);


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleCode = (event) => {
        setCode(event.target.value);
    };

    const handleLogin = async (event) => {

        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
			// console.log('form.checkValidity() === false');
			event.stopPropagation();
			set_validated(true);
		}
        else {
            try 
            {
                const response = await loginInstance.post('/login/', {
                username: formData.username,
                password: formData.password
                });
                if (response) {
                    // console.log('response.status', response.status);
                    // console.log('response.data.2fa', response.data.two_factor);
                }
                if (response && response.status === 200) 
                {
                    // const test = false;
                    setError();
                    if (response.data.two_factor)
                    {
                        // console.log('Login successful 2FA: i go to code page', response);  //SETUP REDIRECT TO HOME PAGE
                        setStep(2);
                        set_validated(false);
                    }
                    else
                    {
                        const token = response.data.access;
                        const refresh = response.data.refresh;
                        axiosInstance.defaults.headers.common['Authorization'] = "JWT " + token;
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + refresh;
                        localStorage.setItem('access_token', token);
                        localStorage.setItem('refresh_token', refresh);

                        // passing  info to userContext
                        // console.log('Login successful no 2FA: navigate to "/"');
                        const decodedToken = jwtDecode(token);
                        // console.log('decoded token', decodedToken);
                        const user = {username: decodedToken.username,
							id: decodedToken.user_id,
							avatar: decodedToken.avatar,
							email:decodedToken.email,
							isActive:decodedToken.is_active,
							exp:decodedToken.exp,
							iat:decodedToken.iat,
							is_staff:decodedToken.is_staff,
							two_factor:decodedToken.two_factor,
							uuid:decodedToken.uuid,
                            isLogged:true,
                            alias:decodedToken.alias,
                            language:decodedToken.language,
                        };  //SETUP REDIRECT TO HOME PAGE

                        localStorage.setItem('user', JSON.stringify(user));
                        
                        userInfo.setUser(user);
                        navigate('/');
                    }
                }
            } catch (error) 
            {
                // console.log('LOGIN CATCH ERROR', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {
                      setError(t('unauthorized'));
                    } else if (error.response.status === 401) {
                      setError(t('incorrect'));
                    } else if (error.response.status >= 500) {
                      setError(t('busy'));
                    } else {
                      setError(t('unknown'));
                    }
                  } else if (error.request) {
                    // The request was made but no response was received
                    setError(t('network'));
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    setError(t('unknown'));
                  }
            } finally {
                // setLoading(false);
            }
        }
    };


    const handleVerify =  async (event) => {
        // alert('A username and password was submitted: ' + formData.username + " " + formData.password);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
			event.stopPropagation();
		}
        else {
            try {
                    const response = await loginInstance.post('/verify/', {
                    username: formData.username,
                    password: formData.password,
                    otp: code
                });
                const token = response.data.access;
                const refresh = response.data.refresh;
                axiosInstance.defaults.headers['Authorization'] = "JWT " + token;
                localStorage.setItem('access_token', token);
                localStorage.setItem('refresh_token', refresh);

                // console.log('Login successful with 2FA: navigate to "/"');
                const decodedToken = jwtDecode(token);
                // console.log('decoded token', decodedToken);
                const user = {username: decodedToken.username, 
                    id: decodedToken.user_id,
                    avatar: decodedToken.avatar,
                    email:decodedToken.email,
                    isActive:decodedToken.is_active,
                    exp:decodedToken.exp,
                    iat:decodedToken.iat,
                    is_staff:decodedToken.is_staff,
                    two_factor:decodedToken.two_factor,
                    uuid:decodedToken.uuid,
                    isLogged: true,
                    alias:decodedToken.alias,
                };  //SETUP REDIRECT TO HOME PAGE
                localStorage.setItem('user', JSON.stringify(user));
                userInfo.setUser(user);
                setStep(1);
                setFormData({ username: "", password: "" });
                setCode('');
                navigate('/');
                // console.log('Login successful with 2fa: i go to home page', response);  //SETUP REDIRECT TO HOME PAGE
            } catch (error)
            {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response) {
                    // if (error.response.status === 400) {
                    //     setError('Invalid OTP. Please try again.');
                    // } else if (error.response.status === 401) {
                    //     setError('Incorrect username or password.');
                    // } else if (error.response.status === 403) {
                    //     setError('Expired OTP. Please request a new one.');
                    // } else if (error.response.status >= 500) {
                    //     setError('Server error. Please try again later.');
                    // } else {
                    //     setError('An error occurred. Please try again.');
                    // }
                    setError(error.response.data.detail);
                }
                else if (error.request)
                {
                    // The request was made but no response was received
                    // console.log('error REQUEST', error.request);
                    setError('Network error. Please check your connection.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    // console.log('error OBSCURE', error.message);
                    setError('An unknown error occurred.');
                }
            }
        }
    };

    return (
        <div>
            {loggedinMessage ? (
                <Container className="mt-5">
                    <Row>
                        <Col
                            md={{
                                span: 6,
                                offset: 3,
                            }}
                        >
                            <p style={{ color: 'green' }}>{loggedinMessage}</p>
                        </Col>
                    </Row>
                </Container>
                ) : step === 1 ? (
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
                                            <Form.Label>{t('username')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                pattern="^[a-zA-Z0-9]+$"
                                                required
                                                isInvalid={
                                                    validated && formData.username.length < 1 &&
                                                    !/^[a-zA-Z0-9]+$/.test(formData.username)
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {t('valid')}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <Form.Label>{t('mdp')} </Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                minLength={6}
                                                required
                                                isInvalid={
                                                    validated && formData.password.length < 6
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {t('len_error')}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    
                                        <Button type='submit' role="button" className="buttonCustom"> {t('Login')} </Button>
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
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
                                    <Form.Label>{t('verif_code')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="verificationCode"
                                        value={code}
                                        onChange={handleCode}
                                        maxLength={6}
                                        required
                                        isInvalid={(code.length !== 6 || !/^[0-9]+$/.test(code))}                                      
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {t('verif_code_error')}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type='submit' role="button" className="buttonCustom"> {t('login')}</Button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </Form>
                        </Col>
                    </Row>
                </Container> )
            }
        </div>
    );
};

export default Login;
