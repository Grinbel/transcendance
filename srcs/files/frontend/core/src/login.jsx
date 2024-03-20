import React, { useState } from "react";
import  { axiosInstance } from "./axiosAPI.js";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
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
            return response.data;
        } catch (error) {
            // console.log('Main Error ', JSON.stringify(error));
            if (error.response) {
                // la requête a été faite et le code de réponse du serveur n’est pas dans
                // la plage 2xx
                console.log('error RESPONSE')
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                if (error.response.status == '401'){
                   navigate('/signup/');
                }
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
            setError(error);
            throw (error);
        }
    };
    console.log("before RETURN");
    if (error) {
        return <span>Caught an error.</span>;
    }
    return (
        <div>Login
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input name="username" type="text" value={formData.username} onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input name="password" type="password" value={formData.password} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Login;
