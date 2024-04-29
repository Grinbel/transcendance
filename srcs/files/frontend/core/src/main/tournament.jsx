import React from "react";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const tournament = () => {
	const userInfo = useContext(userContext);
	const [ws, setWs] = useState(null);
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const [name, setName] = useState('');

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8000/users/ws/tournament/');
		ws.onopen = () => {
			console.log('ws tournament opened');
			const user = {type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament }
			// user = JSON.parse(JSON.stringify(user));
			console.log('user =', JSON.stringify(user));
			ws.send(JSON.stringify({ type: 'connected', username: userInfo.user.username, tournament:userInfo.user.tournament }));
		}
		ws.onclose = () => console.log('ws tournament closed');
		ws.onerror = e => console.log('ws tournament error', e);
		ws.onmessage = e => {
			const message = JSON.parse(e.data);
			if (message.type === 'connected') {
				return;
			}
			if (message.type === 'disconnected') {
				return;
			}
			if (message.type === 'username') {
				setMessages(prevMessages => [...prevMessages, message]);
				setName(message.name);
				// message.date = new Date().toLocaleTimeString();
			}
			console.info('received', message);
		};

		setWs(ws);

		return () => {
			console.error('ws chat closed');
			ws.close();
		};
	}, []);
	return (
		<div>
		<header className="tournament">
			<h1>tournament {name}</h1>
			<div id="chatContent" className="chat-content">
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
			</div>
		</header>
		</div>
	  );
}

export default tournament;
