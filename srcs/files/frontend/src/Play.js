import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from './loading';


function Play() {
	const [isJoining, setIsJoining] = useState(false);
	const [tournamentId, setTournamentId] = useState('');
	const [playerCount, setPlayerCount] = useState(1);
	const [isLocal, setIsLocal] = useState(false);
	const [showSelect, setShowSelect] = useState(false);
	const [showTextArea, setShowTextArea] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
	setIsLoading(true);
	const data = {
		isJoining,
		tournamentId,
		playerCount,
		isLocal
	};
	//! wait for 3s to simulate the server response
	await new Promise((r) => setTimeout(r, 1000));
	setIsLoading(false);
		
		// Send `data` to server...
	  };

	return (
	<div>
		{isLoading ? (
		<Loading />
		) : (
		<>
			<button onClick={() => { setShowTextArea(true); setShowSelect(false); setIsJoining(true); }}>Join Tournament</button>
			<button onClick={() => { setShowSelect(true); setShowTextArea(false); setIsJoining(false); }}>Create Tournament</button>
			
			{showTextArea && (
				<div>
					{showTextArea && <textarea placeholder="Enter tournament ID" value={tournamentId} 
					onChange={(e) => setTournamentId(e.target.value)} />}
					<button onClick={handleSubmit}>Submit</button>
				</div>
			)}
			
			{showSelect && (
			<div>
				<select value={playerCount} onChange={(e) => setPlayerCount(e.target.value)}>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="4">4</option>
				<option value="8">8</option>
				</select>
				<label>Local</label>
				<input type="checkbox" checked={isLocal} onChange={(e) => setIsLocal(e.target.checked)} />
				<button onClick={handleSubmit}>Submit</button>
			</div>
			)}
		</>
		)}
	</div>
	);
}


export default Play;