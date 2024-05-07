import React, { useState } from "react";
import  { axiosInstance } from "./axiosAPI.js";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log('Login: handleChange event.target.name', event.target.name);
    };




    const handleLogin = async (event) => {
        event.preventDefault();
            try 
            {
                const response = await axiosInstance.post('/login/', {
                username: formData.username,
                password: formData.password
                });
                // axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                // localStorage.setItem('access_token', response.data.access);
                // localStorage.setItem('refresh_token', response.data.refresh);
                if (response.data.detail === 'Verification code sent successfully.') 
                {
                    // If the server responds that a verification code has been sent,
                    // move to the next step of the 2FA process
                    setStep(2);
                }
            } catch (error) 
            {
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
                <div>
                <h2>Login</h2>
                { error && <div style={{ color: 'red' }}>{error}</div>}
                <form onSubmit={handleLogin}>
                        <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        </div>
                        <div>
                        <label htmlFor="password">Password:</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                        </div>
                        <button type="submit">Login</button>
                        </form>
                        </div>
                ) : (
                    <div>
                        <h2>Enter the code</h2>
                        <form onSubmit={handleVerify}>
                            <div>
                            <label htmlFor="code">Code:</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    )
            }
        </div>
    );
};

export default Login;
