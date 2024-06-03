import React from "react";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import  { axiosInstance } from "../axiosAPI.js";
import { useGameContext } from "../contexts/GameContext.jsx";

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
	const { setOptions } = useGameContext();
	const [isTrue, setIsTrue] = useState(false);


	function getWebSocket(roomName) {
		if (!websockets[roomName]) {
			 
		  websockets[roomName] = new WebSocket(`ws://${import.meta.env.VITE_API_SERVER_ADDRESS}:8000/users/ws/tournament/${roomName}/?uuid=${userInfo.user.id}`);
		}
		setMessages(prevMessages => [""]);
		return websockets[roomName];
	  }
	
	// const launch = (messages) => {
	// 	console.log("launching",messages);
	// 	messages.sort(() => Math.random() - 0.5);
	// 	const usernames = messages.map(message => message ? message.username : undefined).filter(Boolean);
	// 	  const avatars = messages.map(message => message ? message.avatar : undefined).filter(Boolean);
	// 	  console.log("username:",usernames);
	// 	  console.log("avatar:",avatars);
	// }
	  useEffect(() => {
		if (isTrue === false){
			console.log("return")
			return;
		}
		// user = messages[0];
		console.log("messages",messages);
		const user = messages.map(message => message ? message.username : undefined).filter(Boolean);

		console.log("user",user[0]);
		if (userInfo.user.username != user[0])
		{
			setDisplayer("You are not the host. Go on the screen of ",user[0]," to launch the game.");
			return;
		}
		setDisplayer("Launching");

		// return ;
		//!
		messages.sort(() => Math.random() - 0.5);
		console.log("Message messages ", messages);
		const usernames = messages.map(message => message ? message.username : undefined).filter(Boolean);
		  const avatars = messages.map(message => message ? message.avatar.replace("/media/", "") : undefined).filter(Boolean);
		  console.log("username:",usernames);
		  console.log("avatar:",avatars);
		
		console.log("Launching");
		setOptions(prevOptions => ({
			...prevOptions, // Gardez les options précédentes
			is_tournament : 1,
			usernames : usernames,
			avatar : avatars,
		}));
		//! navigate('/game');
		console.log("userInfo.tournamentIsLaunching",userInfo.tournamentIsLaunching)
	  }, [messages,isTrue]);

	  useEffect(() => {
		console.log("messages",messages);
	  }, [messages]);
	
	useEffect(() => {
		if (userInfo.user === undefined || userInfo.user.tournament === "")
		{
			navigate('/login');
			return;
		}
		// if (userInfo.user.tournament === "default")
		// {
		// 	navigate('/play');
		// 	return;
		// }
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
				// userInfo.setUser({...userInfo.user,tournamentIsLaunching:true});
				setIsTrue(true);
			}
			else if(message.type === "friends")
			{
				setFriend(prevFriend => [...prevFriend,message])

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
