import React from 'react';
import './profileComponents.scss';
import {tournaments, friends, games} from '../../data.jsx';



export const ProfilePreview = () => {

	return (
		<div className='profilePreview'>
			
			<img className='profileImage' src='../../../public/yoshi.jpg' alt="User Avatar" />
			<span className='profileName'>Xavier benoit</span>
			<span className='profileAlias'>#alias</span>
		</div>
	);
};

export const Victories = () => {
	return (
		<div className="globalScore">
			<span className='victories'> Victories</span>

			<span className='victories'> 300Kkk</span>
		</div>

	);
}

export const Losses = () => {
	return (
		<div className="globalScore">
			<span className='losses'> Defeats</span>
			<br/>
			<span className='losses'> 300Kkk</span>
		</div>

	);
}

export const BestScore= () => {
	return (
		<div className="globalScore">
			<span className='bestScore'> Best Score</span>
			<br/>
			<span className='bestScore'> 300Kkk</span>
		</div>

	);
}

export const WorstScore= () => {
	return (
		<div className="globalScore">
			<span className='worstScore'> Worst Score</span>
			<br/>
			<span className='worstScore'> 300Kkk</span>
		</div>

	);
}


export const RecentTournaments = () => {
	return (
		<div className="recentTournaments">
			<span className='title'> Recent Tournaments</span>
			<div className='tournamentList'>
				{tournaments.map((tournament) => (
					<div className='tournament' key={tournament.id}>
						<span className='tournamentName'>{tournament.title}</span>
						{/* <span className='tournamentDate'>{tournament.date}</span>
						<span className='tournamentPlayers'>{tournament.players}</span>
						<span className='tournamentWinner'>{tournament.winner}</span> */}
					</div>
				))}
			</div>
		</div>
	);
}


export const RecentFriends = () => {
	return (
		<div className="recentfriends">
			<span className='title'> Recent Friends</span>
			<div className='friendlist'>
				{friends.map((friend) => (
					<div className='friend' key={friend.id}>
						<img className='friendimage' src={friend.avatar} alt="Friend Avatar" />
						<div className='friendtext'>
							<span className='friendname'>{friend.name}</span>
							<span className='friendalias'>{friend.alias}</span>
						</div>
						<span className='friendrank'>{friend.rank}</span>
					</div>
				))}
			</div>
		</div>
	);

}


export const RecentGames = () => {
	return (
		<div className="recentgames">
			<span className='title'> Recent Games</span>
			<div className='gamelist'>
				{games.map((game) => (
					<div className='game' key={game.id}>
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
								<span className={`playeralias ${game.player2.status ? 'online' : 'offline'}`}  >{game.player2.alias}</span>
							</div>
						</div>
						
					</div>
				))}
			</div>
		</div>
	);
}
