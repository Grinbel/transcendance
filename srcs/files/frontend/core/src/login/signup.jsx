import React, { useState, useEffect } from "react";
import axios from "axios";
import  { axiosInstance } from "../axiosAPI.js";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import '../forms/forms.css'

function Signup() {
    const [validated, set_validated] = useState(true);
    const [error_message, set_error] = useState("");
    const [form_Data, set_Form_Data] = useState({
        username: "",
        pass: "",
        confimPass: "",
        email: "",
    });
    const [userList, setUserList] = useState([]);


    const axiosSignup = axios.create({
        baseURL: 'http://localhost:8000/users/',
        timeout: 0,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

      });

    const existentUser = (value, flag) => {
        console.log('existentUser value and flag', value, flag);
        console.log('UsersList', userList);
        if (flag === "username") {
            let usernameexist = userList.includes(value);
            console.log('username exist ?', usernameexist)
            return usernameexist;
        }
        if (flag === "email") {
            let emailexist = userList.includes(value);
            console.log('email exist ?', emailexist)
            return emailexist;
        }
    };
    
    const submitFn = async (event) => {
        console.log("submitFn event currentTarget: ", event.currentTarget);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        }
        else {
            console.log('Form data to submit:', form_Data);
            // signup the user to backend
            if (userList.includes(form_Data.username) || userList.includes(form_Data.email)) {
                setError('Username already exists');
                return;
              }
            try {
                const response = await axiosInstance.post('/signup/', {
                    username: form_Data.username,
                    password: form_Data.password,
                    email: form_Data.email,
                });
                if (response && response.status === 200) 
                {
                    console.log('user registred successfully response.data', response.data);
                }

            } catch (error) 
            {
                console.log('Error catched in signup.jsx ', JSON.stringify(error));
                if (error.response) {
                    console.error(error.response.status);
                } else if (error.request) {
                    console.error('error REQUEST', error.request);
                } else {
                    console.error('error OBSCURE', error.request);
                }
                set_error(error.message);
                throw (error);
            };
        };
    };

    const chngFn = (event) => {
        console.log('chngFn event.target', event.target);
        const { name, value } = event.target;
        set_Form_Data({
            ...form_Data,
            [name]: value,
        });
    };

    useEffect(() => {
        console.log('////////////// USEEFFECT FUNCTION /////////////');
        const fetchUsersList = async () => {
            try {
                const response = await axiosSignup.get('/list/');
                console.log('fetch list response.data', response.data);
                setUserList (response.data);
            } catch (error) {
                console.log('Error fetching users list: ', error.message);
            }
        };

        fetchUsersList();
        console.log('UserList: ', userList);
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
                    {error_message && <p style={{ color: 'red' }}>{error_message}</p>}
                    <Form className="formCustom" noValidate validated={validated} onSubmit={submitFn}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={form_Data.username}
                                onChange={chngFn}
                                pattern="^[a-zA-Z0-9]+$"
                                required
                                isInvalid={
                                    !/^[a-zA-Z0-9]+$/.test(form_Data.username)
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
                                Password must be at least 6 characters long.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
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
                                Passwords do not match.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
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
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="buttonCustom" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
