import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Play() {
	const [selection, setSelection] = useState(null);
	const [subSelection, setSubSelection] = useState(null);
	const [tournamentId, setTournamentId] = useState('');
	const [playerCount, setPlayerCount] = useState(null);
	const [fillWithBot, setFillWithBot] = useState(false);
	const [isLocal, setIsLocal] = useState(false);

	const handleSelectionChange = (e) => {
		setSelection(e.target.value);
		setSubSelection(null);
	};

	const handleSubSelectionChange = (e) => {
		setSubSelection(e.target.value);
		setTournamentId('');
		setPlayerCount(null);
		setFillWithBot(false);
		setIsLocal(false);
	};
	const handleSubmit = () => {
		const data = {
		  selection,
		  subSelection,
		  tournamentId,
		  playerCount,
		  fillWithBot,
		  isLocal
		};
	  
		// Send `data` to server...
	  };

	return (
		<div>
			<input type="checkbox" checked={isLocal} onChange={(e) => setIsLocal(e.target.checked)} /> Local
			<input type="radio" value="1v1" checked={selection === '1v1'} onChange={handleSelectionChange} /> 1v1
			<input type="radio" value="tournament" checked={selection === 'tournament'} onChange={handleSelectionChange} /> Tournament

			{selection === '1v1' && (
				<div>
					<input type="radio" value="vsPlayer" checked={subSelection === 'vsPlayer'} onChange={handleSubSelectionChange} /> Vs Player
					<input type="radio" value="vsBot" checked={subSelection === 'vsBot'} onChange={handleSubSelectionChange} /> Vs Bot
				</div>
			)}

			{selection === 'tournament' && (
				<div>
					<input type="radio" value="join" checked={subSelection === 'join'} onChange={handleSubSelectionChange} /> Join Tournament
					{subSelection === 'join' && <input type="text" placeholder="Enter Tournament ID" value={tournamentId} onChange={(e) => setTournamentId(e.target.value)} />}
					<input type="radio" value="create" checked={subSelection === 'create'} onChange={handleSubSelectionChange} /> Create One
					{subSelection === 'create' && (
						<div>
							<input type="radio" value="4" checked={playerCount === '4'} onChange={(e) => setPlayerCount(e.target.value)} /> 4 Players
							<input type="radio" value="8" checked={playerCount === '8'} onChange={(e) => setPlayerCount(e.target.value)} /> 8 Players
							<input type="checkbox" checked={fillWithBot} onChange={(e) => setFillWithBot(e.target.checked)} /> Fill with bot after 1 minute?
						</div>
					)}
				</div>
			)}

			{subSelection === 'vsPlayer' && <Link to="/vsPlayer">Go to Vs Player</Link>}
			{subSelection === 'vsBot' && <Link to="/vsBot">Go to Vs Bot</Link>}
			{subSelection === 'join' && <Link to="/joinTournament">Join Tournament</Link>}
			{subSelection === 'create' && playerCount && <Link to="/createTournament">Create Tournament</Link>}
			{/* {(subSelection != null ) && <button onClick={handleSubmit}>Submit</button>} */}
			{( subSelection === 'vsPlayer' || subSelection === 'vsBot') && <button onClick={handleSubmit}>Submit</button>}
		</div>
	);
}

export default Play;