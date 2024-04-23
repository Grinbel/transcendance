import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from './loading';
import  { axiosInstance } from "./axiosAPI.js";


function Play() {
	const [playerCount, setPlayerCount] = useState(1);
	const [isLocal, setIsLocal] = useState(false);
	const [showSelect, setShowSelect] = useState(false);
	const [showTextArea, setShowTextArea] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [join, setJoin] = useState(false);
	const [formData, setFormData] = useState({ tournamentId: "", playerCount: 1, isLocal: false });
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
		if (join  && formData.tournamentId === ""){
			return;
		}
		setIsLoading(true);
		event.preventDefault();
		try {
			const response = await axiosInstance.post('/choice/', {
				tournamentId: formData.tournamentId,
				playerCount: formData.playerCount,
				isLocal: formData.isLocal,
			});
			console.log('response', response.data);
			//check if response.data contains the word error

			if (response.data.includes('Error:')){
				response.data = response.data.replace('Error:', '');
				setDisplayer(response.data);
				console.log('Invalid tournament');
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
				setFormData({ tournamentId: "", isLocal: false, playerCount: 1 });
				setJoin(true);
				}}>Join Tournament</button>
			<button onClick={() => { 
				setShowSelect(true);
				setShowTextArea(false);
				setFormData({ tournamentId: "", isLocal: false, playerCount: 1 });
				setJoin(false);
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
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="4">4</option>
				<option value="8">8</option>
				</select>
				<label>
					Local
					<input
						type="checkbox"
						id="isLocal"
						name="isLocal"
						checked={formData.isLocal}
						onChange={handleChange}
						/>
				</label>
				<button onClick={handleSubmit}>Submit</button>
			</div>
			)}
					<div className='error'>
						{displayer}
					</div>
		</>
		)}
	</div>
	);
}


export default Play;