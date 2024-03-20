import React, { useState } from "react";
import  { axiosInstance } from "./axiosAPI.js";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log('Login: handleChange event.target.name', event.target.name);
    };
    console.log('Login: formData.username', formData.username);
    const handleSubmit =  async (event) => {
        // alert('A username and password was submitted: ' + formData.username + " " + formData.password);
        event.preventDefault();
        try {
                const response = await axiosInstance.post('/token/obtain/', {
                username: formData.username,
                password: formData.password
            });
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            console.log('Login successful: i go to home page', response);
    
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
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
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
  );
};

export default Login;
