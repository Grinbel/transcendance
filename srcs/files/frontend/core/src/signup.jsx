import React, { useState } from "react";
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://your-api-url/signup/", formData);
            // Optionally handle successful signup, such as redirecting to another page
            console.log("Signup successful:", response.data);
        } catch (error) {
            // Handle signup errors
            setError(error.response.data.detail);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input name="username" type="text" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default Signup;
