import React from "react";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import  { axiosInstance } from "../axiosAPI.js";
import { useGameContext } from "../contexts/GameContext.jsx";
import { useTranslation } from 'react-i18next';


const tournament = () => {
	const { t } = useTranslation();
	const userInfo = useContext(userContext);
	const [ws, setWs] = useState(null);
	const [messages, setMessages] = useState([]);
	const [friend,setFriend] = useState([]);
	const messagesEndRef = useRef(null);
	const [name, setName] = useState('');
	const [maxCapacity, setMaxCapacity] = useState(2);
	const [displayer, setDisplayer] = useState("");
	const navigate = useNavigate();
	const websockets = {};
	const { setOptions } = useGameContext();
	const [isTrue, setIsTrue] = useState(false);

	const nextgameplayer = async (name) => {
		
		try {
			const response = await axiosInstance.post('/nextgameplayer/', {
				p1: 'bob',
				p2: 'alice',
				room: name,
				
			});
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const options = async (name) => {
		
		try {
			const response = await axiosInstance.post('/options/', {
				room: name,
			});
			console.log("RESPONSE",response.data)
			const data = response.data
			return data
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const end_of_game = async (name,winner) => {
			
		try {
			const response = await axiosInstance.post('/endofgame/', {
				room: name,
				winner: winner,
			});
		} catch (error) {
			// setError(error.message);
			throw (error);
		}
	}

	function getWebSocket(roomName) {
		if (!websockets[roomName]) {
			 
		  websockets[roomName] = new WebSocket(`ws://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/ws/tournament/${roomName}/?uuid=${userInfo.user.id}`);
		}
		setMessages(prevMessages => [""]);
		return websockets[roomName];
	  }
	
	const launch = (messages) => {
		console.log("launching",messages);
		messages.sort(() => Math.random() - 0.5);
		const usernames = messages.map(message => message ? message.username : undefined).filter(Boolean);
		  const avatars = messages.map(message => message ? message.avatar : undefined).filter(Boolean);
		  console.log("username:",usernames);
		  console.log("avatar:",avatars);
	}
	const delay = ms => new Promise(res => setTimeout(res, ms));
	  useEffect(() => {
		if (isTrue === false){
			return;
		}
		// console.log("messages",messages);
		const user = messages.map(message => message ? message.username : undefined).filter(Boolean);
		const sortedMessages = [...user].sort((a, b) => a.localeCompare(b));

		if (userInfo.user.username === sortedMessages[0])
			{
			setDisplayer(t("Launching"));

			messages.sort(() => Math.random() - 0.5);
			console.log("Message messages ", messages);
			const usernames = messages.map(message => message ? message.username : undefined).filter(Boolean);
			const avatars = messages.map(message => message ? message.avatar.replace("/media/", "") : undefined).filter(Boolean);
			const alias = messages.map(message => message ? message.alias : undefined).filter(Boolean);
			const option = options(name).then(data =>{
				
				switch(data.skin){
					case 1:
						data = {...data, texture_ball: "basketball.jpg", texture_floor: "basket.jpg",stage_height: 6,stage_width: 9};
						break;
					case 2:
						data = {...data, texture_ball: "https://thumbs.dreamstime.com/b/bille-de-football-de-texture-13533294.jpg", texture_floor: "https://t2.uc.ltmcdn.com/fr/posts/8/4/8/quelle_est_la_taille_d_un_terrain_de_football_12848_600.webp",stage_height: 8,stage_width: 15};
						break;
					case 3:
						data = {...data, texture_ball: "billardball.png", texture_floor: "billardtable.png",stage_height: 12,stage_width: 20};
						break;
					case 4:
						data = {...data, texture_ball: "tennisball.jpg", texture_floor: "tennisfield.jpg",stage_height: 16,stage_width: 30};
						break;
					default:
						break;
				}
				console.log("DATA!!!!!!!!",data);
				setOptions(prevOptions => ({
					...prevOptions, // Gardez les options précédentes
					is_tournament : 1,
					usernames : alias,
					avatar : avatars,
					room : name,
					alias: usernames,
					ball_starting_speed: data.ball_starting_speed,
					texture_ball: data.texture_ball,
					score_to_get: data.score,
					score_max:data.score + 4,
					easy_mode: data.easyMode,
					real_game : 1,
					texture_floor : data.texture_floor,
					stage_height: data.stage_height,
					stage_width: data.stage_width,
				}));
				delay(1000).then(() => navigate('/game'));
			});
			setIsTrue(false);
			// nextgameplayer(name);
			// end_of_game(name,userInfo.user.username);
			setDisplayer(t('host'));
			delay(3000).then(() => navigate('/game'));
		}
		else
		{
			setIsTrue(false);
			setDisplayer(t('not_host') +user[0] +t('not_host2'));
			// delay(5000).then(() => navigate('/'));
		}
	}, [messages,isTrue,name]);

	useEffect(() => {
		if (userInfo.user === undefined)
		{
			navigate('/login');
			return;
		}
		if (userInfo.user.tournament === undefined || userInfo.user.tournament === "" || userInfo.user.tournament === "default")
		{
			navigate('/play');
			return;
		}
		const ws = getWebSocket(userInfo.user.tournament);
		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament ,alias:userInfo.user.alias}));
		}
		ws.onclose = () => {
		}
		ws.onerror = e => console.log('ws tournament error', e);
		ws.onmessage = e => {
			const message = JSON.parse(e.data);
			if (message.type === 'connected') {
				return;
			}
			else if (message.type === 'disconnected') {
				setMessages(prevMessages => []);
				ws.send(JSON.stringify({ type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament, alias:userInfo.user.alias }));
				return;
			}
			else if (message.type === 'username') {
				if (message && message.username)
				{
					setMessages(prevMessages => [...prevMessages, message]);
					setName(message.name);
					setMaxCapacity(message.max_capacity)					
				}
			}
			else if (message.type === 'launch_tournament'){
				// setDisplayer("Launching in " + message.timer + " seconds");
				console.log("set tournamentIsLaunching")
				// userInfo.setUser({...userInfo.user,tournamentIsLaunching:true});
				setIsTrue(true);
			}
			else if(message.type === "friends")
			{
				setFriend(prevFriend => [...prevFriend,message])
			}
			else if (message.type === 'end')
			{
				setDisplayer(t('over'));
				delay(5000).then(() => navigate('/'));
				// ws.close();
			}
			// console.info('received', message);
		};

		setWs(ws);

		return () => {
			console.error('ws tournament closed');
			ws.close();
		};
	}, [userInfo.user]);

	const sendInvite = async(username)=>
	{
		console.log("INVITE ",username)
		try {
			const response = await axiosInstance.post('/inviteTournament/', {
				receiver: username,
				room: name,
				self: userInfo.user.username,
			});
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}
	if (userInfo.user === undefined )
		return (<div />);
	return (
		<div>
		<header className="tournament">
			<h1>{t('tournament')} {name}</h1>

			<h3>Max player: {maxCapacity}</h3>
			<div id="chatContent" className="chat-content">
				<h4>{t('player')}</h4>
				{messages.map((message, index) => (
					<div key={index} className="chat-message" ref={index === messages.length - 1 ? messagesEndRef : null}>
						<div className="chat-username">
							<Link to={`/${message.username}`}>
								{message.alias}
							</Link>
						</div>
						<div />
					</div>
				))}
			<div className="friend">
				<h6>{t('friend_list')}</h6>
				{friend.map((message, index) => (
					<div key={index} className="chat-message" ref={index === friend.length - 1 ? messagesEndRef : null}>
						<div className="chat-username">
						<a href="#" onClick={(e) => {e.preventDefault(); sendInvite(message.friend);}}>
						{message.friend}
						</a>
						</div>
						<div />
					</div>
				))}
			</div>

			<h3>{displayer}</h3>
			</div>
		</header>
		</div>
	  );
}

export default tournament;
