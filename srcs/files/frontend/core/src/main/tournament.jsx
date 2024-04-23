import React from "react";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { useEffect, useState, useRef } from 'react';

const tournament = () => {
	const userInfo = useContext(userContext);
	const [ws, setWs] = useState(null);

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8000/users/ws/tournament/');
		ws.onopen = () => console.log('ws tournament opened');
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
			if (message.type === 'error') {
				//print the message in red
			}
			if (message.type === 'chat') {
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
			<h1>tournament</h1>
		  </header>
		</div>
	  );
}

export default tournament;
