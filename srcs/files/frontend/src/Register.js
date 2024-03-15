import React, { useState } from "react";
import axios from 'axios';
import "./App.css";

function validateInput(username, password) {
    // Check if username is between 4 and 16 characters and doesn't contain special characters
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    if (!usernameRegex.test(username)) {
        alert('Username must be between 4 and 16 characters and contain no special characters');
        return false;
    }

    // Check if password is longer than 8 characters, contains at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('Password must be longer than 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return false;
    }

    return true;
}

const Register = () => {
  const [registerData, setRegisterData] = useState({username: '', password: ''});

  const handleChange = e => {
    setRegisterData({...registerData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async e => {
	e.preventDefault();
	if (!validateInput(registerData.username, registerData.password)) {
		return;
	}
	try {
	  const response = await axios.post('http://localhost:8000/profiles/register/', registerData);
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
      <header className="Register">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="username" value={registerData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="password" value={registerData.password} onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
      </header>
    </div>
  );
}

export default Register;