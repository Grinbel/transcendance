import React, { useState } from "react";
import axios from 'axios';
import "./App.css";


const Login = () => {
  const [loginData, setLoginData] = useState({username: '', password: ''});

  const handleChange = e => {
    setLoginData({...loginData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async e => {
	e.preventDefault();
	try {
	  const response = await axios.post('http://localhost:8000/profiles/login/', loginData);
	  if (response.data.status === 'success') {
		// Login was successful
		// You can now do whatever you want with the response
		console.log(response.data.message);
	  } else {
		// Login failed
		console.error(response.data.message);
	  }
	} catch (error) {
	  console.error(error);
	}
  }

  return (
    <div>
      <header className="Login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={loginData.username} onChange={handleChange} required />
          <input type="password" name="password" value={loginData.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default Login;