import React from "react";
import "./App.css";
import { useParams } from 'react-router-dom';

function Account() {
    const { username } = useParams();
    // Now you can use the username in your component
	return (
		<div>
			<h1>{username}</h1>
			//TODO texte brut

			<h1> hi</h1>
		</div>
	);
}



export default Account;
