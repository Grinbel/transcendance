import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useMultiGameContext } from './contexts/MultiGameContext.jsx';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const MultiOptions = () => {
	const { t } = useTranslation();
	const { setOptions: setMultiGameOptions } = useMultiGameContext();
	const navigate = useNavigate();
	const [playerCount, setPlayerCount] = useState(2);
	const [buttonCount, setButtonCount] = useState(1);
	const [ballSpeed, setBallSpeed] = useState(50);
	const [score, setScore] = useState(5);
	const [skin, setSkin] = useState();
	const [alias, setAlias] = useState('');
	const [floor, setFloor] = useState('basket.jpg');
	const [ball, setBall] = useState('basketball.jpg');
	const [height, setHeight] = useState(9);
	const [width, setWidth] = useState(9);
	const [launch, setLaunch] = useState(false);
	const [skinObject, setSkinObject] = useState({
		texture_ball: 'ballon_de_foot.jpg',
		texture_floor: 'terrain_foot.webp',
		stage_radius: 5,
		ball_radius: 0.5,
	});

	const handleChange = (event) => {
		const newSkinObject = JSON.parse(event.target.value);
		setSkinObject(newSkinObject);
	};
	const handleStartGame = () => {
		setMultiGameOptions((prevOptions) => ({
			...prevOptions,
			nb_players: playerCount,
			nb_buttons: buttonCount,
			ball_starting_speed: ballSpeed / 1000,
			score_to_get: score,
			score_max: score + 4,
			texture_ball: skinObject.texture_ball,
			texture_floor: skinObject.texture_floor,
			stage_radius: skinObject.stage_radius,
			ball_radius: skinObject.ball_radius,
		}));
		navigate('/multigame');
	};

	return (
		<div className='Play'>
			<Dropdown onSelect={(e) => setPlayerCount(Number(e))}>
				<Dropdown.Toggle variant='primary'>
					{`${t('nb_joueurs')}: ${playerCount}`}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item eventKey='2'>2 {t('players')}</Dropdown.Item>
					<Dropdown.Item eventKey='3'>3 {t('players')}</Dropdown.Item>
					<Dropdown.Item eventKey='4'>4 {t('players')}</Dropdown.Item>
					<Dropdown.Item eventKey='5'>5 {t('players')}</Dropdown.Item>
					<Dropdown.Item eventKey='6'>6 {t('players')}</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			{(playerCount === 2 || playerCount === 3) && (
				<Dropdown onSelect={(e) => setButtonCount(Number(e))}>
					<Dropdown.Toggle variant='primary'>
						{`${t('nb_buttons')}: ${buttonCount}`}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item eventKey='1'>1 {t('button')}</Dropdown.Item>
						<Dropdown.Item eventKey='2'>2 {t('buttons')}</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			)}
			<p />
			<input
				type='range'
				min='1'
				max='200'
				step='1'
				value={ballSpeed}
				onChange={(e) => setBallSpeed(parseFloat(e.target.value))}
			/>
			<p>
				{t('ball_speed')}: {ballSpeed}
			</p>
			<input
				type='range'
				min='1'
				max='15'
				step='1'
				value={score}
				onChange={(e) => setScore(parseFloat(e.target.value))}
			/>
			<p>
				{t('score_toget')}: {score}
			</p>
			<p>
				{' '}
				{t('terrain')}:
				<select
					value={skin}
					type='number'
					id='playerCount'
					name='playerCount'
					onChange={handleChange}
				>
					<option
						value={JSON.stringify({
							texture_ball: 'ballon_de_foot.jpg',
							texture_floor: 'terrain_foot.webp',
							stage_radius: 5,
							ball_radius: 0.5,
						})}
					>
						{t('football')}
					</option>
					<option
						value={JSON.stringify({
							texture_ball: 'basketball.jpg',
							texture_floor: 'basket.jpg',
							stage_radius: 5,
							ball_radius: 0.3,
						})}
					>
						{t('basketball')}
					</option>
					<option
						value={JSON.stringify({
							texture_ball: 'billardball.png',
							texture_floor: 'billardtable.png',
							stage_radius: 5,
							ball_radius: 0.1,
						})}
					>
						{t('billard')}
					</option>
					<option
						value={JSON.stringify({
							texture_ball: 'tennisball.jpg',
							texture_floor: 'tennisfield.jpg',
							stage_radius: 5,
							ball_radius: 0.2,
						})}
					>
						{t('tennis')}
					</option>
				</select>
			</p>
			<Button variant='primary' onClick={handleStartGame}>
				{t('start game')}
			</Button>
		</div>
	);
};

export default MultiOptions;
