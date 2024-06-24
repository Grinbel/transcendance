import React, { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import Loading from './loading';
import { axiosInstance} from '../axiosAPI.js';
import { useContext } from 'react';
import { userContext } from '../contexts/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import './Home.css';

function Play() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const userInfo = useContext(userContext);
	const [showSelect, setShowSelect] = useState(false);
	const [showTextArea, setShowTextArea] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [join, setJoin] = useState(false);
	const [ballSpeed, setBallSpeed] = useState(50);
	const [score, setScore] = useState(10);
	const [skin, setSkin] = useState(2);
	const [alias, setAlias] = useState('');
	const [formData, setFormData] = useState({
		tournamentId: '',
		playerCount: 2,
		isEasy: false,
	});
	const [displayer, setDisplayer] = useState('');

	const handleChange = (event) => {
		const value =
			event.target.type === 'checkbox'
				? event.target.checked
				: event.target.value;
		setFormData({
			...formData,
			[event.target.name]: value,
		});
		// console.log('Login: handleChange event.target.name', event.target.name);
		// console.log(value);
	};

	const handleChangeSpeed = (event) => {
		setBallSpeed(event.target.value);
		// console.log((event.target.value))
	};
	const handleSubmit = async (event) => {
		// if (join  && formData.tournamentId === ""){
		// 	return;
		// }
		if (userInfo.user === undefined) {
			setDisplayer(t('please_login'));
			return;
		}
		setDisplayer('');
		// setIsLoading(true);
		event.preventDefault();
		if (alias === '') {
			setAlias(userInfo.user.username);
		}
		console.log('alias', alias);
		console.log('username', userInfo.user.username, userInfo.user);

		try {
			const response = await axiosInstance.post('/choice/', {
				tournamentId: formData.tournamentId,
				playerCount: formData.playerCount,
				isEasy: formData.isEasy,
				username: userInfo.user.username,
				join: join,
				alias: alias === '' ? userInfo.user.username : alias,
				speed: ballSpeed,
				score: score,
				skin: skin,
			});

			//check if response.data contains the word error

			if (response.data.Error != undefined) {
				setDisplayer(t(response.data.Error));
				// console.log('Invalid tournament');
			} else {
				// console.log('Tournament name: ' + response.data.room_name);

				userInfo.setUser({
					...userInfo.user,
					tournament: response.data.room_name,
					alias: alias === '' ? userInfo.user.username : alias,
				});
				const local = userInfo.user;
				localStorage.setItem('user', JSON.stringify(local));
				navigate('/tournament/');
			}
		} catch (error) {
			if (error.response) {
			} else if (error.request) {
				// console.log('error REQUEST', error.request);
			} else {
				// console.log('error OBSCURE', error.request);
			}
			// setError(error.message);
			throw error;
		}
		setIsLoading(false);
	};

	return (
		<div className='Play'>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<Button
						onClick={() => {
							setShowTextArea(true);
							setShowSelect(false);
							setFormData({ tournamentId: '', isEasy: false, playerCount: 2 });
							setJoin(true);
						}}
					>
						{t('join_tournament')}
					</Button>
					<Button
						onClick={() => {
							setShowSelect(true);
							setShowTextArea(false);
							setFormData({ tournamentId: '', isEasy: false, playerCount: 2 });
							setJoin(false);
						}}
					>
						{t('create_tournament')}
					</Button>

					{showTextArea && (
						<div>
							{/* <label htmlFor="tournamentId"></label> */}
							<input
								type='text'
								id='tournamentId'
								name='tournamentId'
								placeholder={t('Enter tournament ID')}
								value={formData.tournamentId}
								onChange={handleChange}
								maxLength='6'
							/>
							{/* <label htmlFor="alias"></label> */}
							<input
								type='text'
								id='alias1'
								name='alias'
								placeholder={t('Enter alias')}
								value={alias}
								onChange={(e) => {
									const re = /^[a-zA-Z0-9]+$/; // Regex for alphanumeric characters
									if (e.target.value === '' || re.test(e.target.value)) {
										setAlias(e.target.value);
									}
								}}
								maxLength='7'
							/>
							<Button onClick={handleSubmit}>{t('submit')}</Button>
						</div>
					)}

					{showSelect && (
						<div>
							<p>
								{t('Nb joueurs')}
								<select
									value={formData.playerCount}
									type='number'
									id='playerCount1'
									name='playerCount'
									onChange={handleChange}
								>
									<option value='2'>2</option>
									<option value='4'>4</option>
									<option value='8'>8</option>
								</select>
							</p>

							<label>
								{t('Easy mode')}
								<input
									type='checkbox'
									id='isEasy'
									name='isEasy'
									checked={formData.isEasy}
									onChange={handleChange}
								/>
							</label>
							<p />
							<input
								type='text'
								id='alias'
								name='alias'
								placeholder={t('Enter alias')}
								value={alias}
								onChange={(e) => {
									const re = /^[a-zA-Z0-9]+$/; // Regex for alphanumeric characters
									if (e.target.value === '' || re.test(e.target.value)) {
										setAlias(e.target.value);
									}
								}}
								maxLength='7'
							/>
							<p />
							<input
								type='range'
								min='20'
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
								min='5'
								max='25'
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
									onChange={(e) => setSkin(e.target.value)}
								>
									<option value='1'>{t('basketball')}</option>
									<option value='2'>{t('football')}</option>
									<option value='3'>{t('billard')}</option>
									<option value='4'>{t('tennis')}</option>
								</select>
							</p>
							<Button onClick={handleSubmit}>{t('submit')}</Button>
						</div>
					)}
					<div className='displayer-errors'>{displayer}</div>
				</>
			)}
		</div>
	);
}

export default Play;
