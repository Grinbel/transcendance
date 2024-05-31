import React from "react";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import  { axiosInstance } from "../axiosAPI.js";
import Game from "../game.jsx";

const tournament = () => {
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

	function getWebSocket(roomName) {
		if (!websockets[roomName]) {
			 
		  websockets[roomName] = new WebSocket(`ws://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/ws/tournament/${roomName}/?uuid=${userInfo.user.id}`);
		}
		setMessages(prevMessages => [""]);
		return websockets[roomName];
	  }
	  useEffect(() => {
		console.log("Message messages ", messages);
		if (userInfo.tournamentIsLaunching === true)
			console.log("LAUNCHING", messages.username)
	  }, [messages,userInfo]);


	  useEffect(() => {
		console.log("Launching");
		// messages.shuffle()
		messages.sort(() => Math.random() - 0.5);
		const usernames = messages.map(message => message ? message.username : undefined).filter(Boolean);
		const avatars = messages.map(message => message ? message.avatar : undefined).filter(Boolean);
		const trueArray = new Array(usernames.length).fill(true);
		console.log("username:",usernames);
		console.log("avatar:",avatars);
		console.log("trueArray:",trueArray);
	}, [userInfo,messages]);
	
	useEffect(() => {
		if (userInfo.user === undefined || userInfo.user.tournament === undefined)
			return ;
		else if (userInfo.user.username === "default")
		{
			navigate('/login');
			return;
		}
		else if (userInfo.user.tournament === "default")
		{
			navigate('/play');
			return;
		}
		const ws = getWebSocket(userInfo.user.tournament);
		ws.onopen = () => {
			const user = {type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament }
			ws.send(JSON.stringify({ type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament }));
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
				ws.send(JSON.stringify({ type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament }));
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
				setDisplayer("Launching in " + message.timer + " seconds");
				console.log("set tournamentIsLaunching")
				userInfo.setUser({...userInfo.user,tournamentIsLaunching:true});
			}
			else if(message.type === "friends")
			{
				setFriend(prevFriend => [...prevFriend,message])

			}
			console.info('received', message);
		};

		setWs(ws);

		return () => {
			console.error('ws chat closed');
			ws.close();
		};
	}, []);

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
		{/* //TODO texte brut */}

			<h1>tournament {name}</h1>
			{/* //TODO texte brut */}

			<h3>Max player: {maxCapacity}</h3>
			<div id="chatContent" className="chat-content">
				<h4>Player</h4>
				{messages.map((message, index) => (
					<div key={index} className="chat-message" ref={index === messages.length - 1 ? messagesEndRef : null}>
						<div className="chat-username">
							<Link to={`/${message.username}`}>
							{message.username}
							</Link>
						</div>
						<div />
					</div>
				))}
			<div className="friend">
				<h6>Friend List</h6>
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
								{/* //TODO texte brut */}

			<h3>{displayer}</h3>
			</div>
		</header>
		</div>
	  );
}

export default tournament;
