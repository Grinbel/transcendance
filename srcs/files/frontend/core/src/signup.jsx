import React, { useState } from "react";
import axios from "axios";
import  { axiosInstance } from "./axiosAPI.js";

function Signup() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
		console.log("formData:", formData);
        try {
            const response = await axiosInstance.post("/signup/", formData);
            // Optionally handle successful signup, such as redirecting to another page
            console.log("Signup successful:", response.data);
        } catch (error) {
            // Handle signup error
			console.log("Error sign-in:", error.response.data);
            setError(error.response.data);
        }
    };

    return (
        <div>
            Signup
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input name="username" type="text" value={formData.username} onChange={handleChange}/>
                    { error.username ? error.username : null}
                </label>
                <label>
                    Email:
                    <input name="email" type="email" value={formData.email} onChange={handleChange}/>
                    { error.email ? error.email : null}
                </label>
                <label>
                    Password:
                    <input name="password" type="password" value={formData.password} onChange={handleChange}/>
                    { error.password ? error.password : null}
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

export default Signup;
