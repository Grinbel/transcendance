import React, { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import Loading from './loading';
import  { axiosInstance } from "../axiosAPI.js";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import { useNavigate } from 'react-router-dom';
import "./Home.css";

function Play() {
	const navigateTo = useNavigate();
	const userInfo = useContext(userContext);
	const [showSelect, setShowSelect] = useState(false);
	const [showTextArea, setShowTextArea] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [join, setJoin] = useState(false);
	const [formData, setFormData] = useState({ tournamentId: "", playerCount: 2, isLocal: false });
	const [displayer, setDisplayer] = useState("");

	const handleChange = (event) => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		setFormData({
			...formData,
			[event.target.name]: value
		});
		console.log('Login: handleChange event.target.name', event.target.name);
		console.log(value);
	};

	const handleSubmit = async (event) => {
		
		// if (join  && formData.tournamentId === ""){
		// 	return;
		// }
		if (userInfo.user.isLogged ===  false){
			setDisplayer("Please login to play");
			return;
		}
		setDisplayer("");
		// setIsLoading(true);
		event.preventDefault();
		try {
			const response = await axiosInstance.post('/choice/', {
				tournamentId: formData.tournamentId,
				playerCount: formData.playerCount,
				isLocal: formData.isLocal,
				username: userInfo.user.username,
				join:join  && formData.tournamentId === "",
			});
			console.log('response', response.data);
			console.log('Room name', response.data.room_name);
			console.log('error', response.data.Error);

			//check if response.data contains the word error

			if (response.data.Error != undefined){
				setDisplayer(response.data.Error);
				console.log('Invalid tournament');
			}
			else {
				console.log('Tournament name: ' + response.data.room_name);

				userInfo.setUser({
					...userInfo.user,
					tournament: response.data.room_name
				  });
				// console.log('Tournament name: ' + userInfo.user.tournament);
				// console.log('User info: ' + userInfo.user.username);
				navigateTo('/tournament/');
				// props.router.push('/');
			}
		} catch (error) {
			if (error.response) {
	
			} else if (error.request) {
				console.log('error REQUEST', error.request);
			} else {
				console.log('error OBSCURE', error.request);
			}
			setError(error.message);
			throw (error);
		}
		setIsLoading(false);

	}
	
	return (
	<div>
		{isLoading ? (
		<Loading />
		) : (
		<>
			<button onClick={() => { 
				setShowTextArea(true); 
				setShowSelect(false); 
				setFormData({ tournamentId: "", isLocal: false, playerCount: 2 });
				setJoin(true);
									// TODO texte brut
				}}>Join Tournament</button>
			<button onClick={() => { 
				setShowSelect(true);
				setShowTextArea(false);
				setFormData({ tournamentId: "", isLocal: false, playerCount: 2 });
				setJoin(false);
									// TODO texte brut

				}}>Create Tournament</button>
			
			{showTextArea && (
				
				<div>
					<label htmlFor="tournamentId"></label>
						<input
							type="text"
							id="tournamentId"
							name="tournamentId"
							placeholder="Enter tournament ID"
							value={formData.tournamentId}
							onChange={handleChange}
							/>
									{/* //TODO texte brut */}

					<button onClick={handleSubmit}>Submit</button>
				</div>
			)}
			
			{showSelect && (
				<div>
				<select value={formData.playerCount} 
					type="number"
					id="playerCount"
					name="playerCount"
					onChange={handleChange}>
				<option value="2">2</option>
				<option value="4">4</option>
				<option value="8">8</option>
				</select>
				<label>
				{/* //TODO texte brut */}

					Local
					<input
						type="checkbox"
						id="isLocal"
						name="isLocal"
						checked={formData.isLocal}
						onChange={handleChange}
						/>
				</label>
				{/* //TODO texte brut */}

				<button onClick={handleSubmit}>Submit</button>
			</div>
			)}
			<div className="displayer-errors">
			{/* //TODO texte brut */}

				{displayer}
			</div>
		</>
		)}
	</div>
	);
}


export default Play;