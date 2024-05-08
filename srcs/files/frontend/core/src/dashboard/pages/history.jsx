import React from 'react';
import './history.scss';
import {historygames} from '../../data.jsx';

const History = () => {

	
	return (
		<div className="history">History
		<div className="header">
			<span className="headerItem ">Players</span>
			<span className="headerItem ">date</span>
			<span className="headerItem ">score</span>
			<span className="headerItem ">tournament</span>
		</div>
			{historygames.slice(0, 3).map((game) => {
			return (
				<div className="game" key={game.id}>

					<div className=" basic players">{game.name}
						<div className='player'>
								<img className='playerimage' src={game.player1.avatar} alt="player Avatar" />
								<div className='playertext'>
									<span className='playeralias'>{game.player1.alias}</span>
								</div>
							</div>
							<div className='vs'> VS</div>
							<div className='player'>
								<img className='playerimage' src={game.player2.avatar} alt="player Avatar" />
								<div className='playertext'>
									<span className='playeralias'>{game.player2.alias}</span>
							</div>
						</div>
					</div>

					<span className="basic gameDate">{game.date}</span>
					<span className="basic gameScore">{game.score}</span>
					<span className="basic gameTournament">{game.tournament}</span>

				</div>
			);
		})}
		</div>
	);
}
export default History;