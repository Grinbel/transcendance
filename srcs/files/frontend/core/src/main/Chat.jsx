import React from 'react';
// import  { axiosInstance } from "./axiosAPI.js";
import  { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import "./Chat.css";
import "./Home.css";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { axiosInstance } from "../axiosAPI.js";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

{/*const handleChat = async (event) => {
	event.preventDefault();
	try {
		const response = await axiosInstance.post('/chat/', {
			// username: formData.username,
			message: formData.message,
			// date: formData.date
		});
		
		//send packet to server
		

	} catch (error) {
		if (error.response) {
			console.log('error RESPONSE')
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		} else if (error.request) {
			console.log('error REQUEST', error.request);
		} else {
			// quelque chose s’est passé lors de la construction de la requête et cela
			// a provoqué une erreur
			console.log('error OBSCURE', error.request);
		}
		setError(error.message);
		throw (error);
	}
}
class Chat extends React.Component {
	lastMessageRef = React.createRef();
	state = {
		isChatOpen: true,
		messages: [],
		currentInput: ''
	}
	componentDidUpdate() {
		if (this.lastMessageRef.current) {
			this.lastMessageRef.current.scrollIndisplayer({ behavior: 'smooth' });
		}
	}

	handleCloseClick = () => {
		this.setState({ isChatOpen: false });
	}

	handleOpenClick = () => {
		this.setState({ isChatOpen: true });
	} 

	handleInputChange = (event) => {
		this.setState({ currentInput: event.target.value });
	}

	handleSendClick = () => {
		const currentTime = new Date();
		const formattedTime = currentTime.getHours() + ':' + currentTime.getMinutes();
	
		this.setState(prevState => ({
			messages: [...prevState.messages, { text: prevState.currentInput, time: formattedTime }],
			currentInput: ''
		}));
	}

	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.handleSendClick();
			event.preventDefault(); // Prevents the default action of the 'Enter' key
		}
	}

	render() {
		const { isChatOpen, messages, currentInput } = this.state;

		return (
			<div id="chatWindow" className={`chat-window ${isChatOpen ? '' : 'retracted'}`}>
				<div id="chatHeader" className="chat-header">
					<div id="chatTitle" className="chat-title">Chat</div>
					{isChatOpen ? (
						<div id="chatClose" className="chat-close" onClick={this.handleCloseClick}>X</div>
					) : (
						<div id="chatOpen" className="chat-open" onClick={this.handleOpenClick}>O</div>
					)}
				</div>
				{isChatOpen && (
					<div id="chatBody" className="chat-body">
						<div id="chatContent" className="chat-content">
							{messages.map((message, index) => (
								<div
									key={index}
									className="chat-message"
									ref={index === messages.length - 1 ? this.lastMessageRef : null}
								>
									{message.text} <span className="message-time">{message.time}</span>
								</div>
							))}
						</div>
						<div id="chatInput" className="chat-input">
							<input
								type="text"
								id="chatInputField"
								className="chat-input-field"
								value={currentInput}
								onChange={this.handleInputChange}
								onKeyDown={this.handleKeyPress}
							/>
							<button id="chatSend" className="chat-send" onClick={this.handleSendClick}>Send</button>
						</div>
					</div>
				)}
			</div>
			
		);
	}
}*/}

// function websockets() {
// 	const response = await axiosInstance.post('/login/', {
// 		username: formData.username,
// 		password: formData.password
// 		});
// }

function Chat() {
	const userInfo = useContext(userContext);
	
	const [formData, setFormData] = useState({ message: '', date: '', username: '' });
	const [error, setError] = useState(null);
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState(null);
	const messagesEndRef = useRef(null);
	const [displayer, setdisplayer] = useState("");
	const [roomName,setRoomName] = useState("general");
	const websockets = {};
	
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	function getWebSocket(roomName) {
		
		if (!websockets[roomName]) {
		  websockets[roomName] = new WebSocket(`ws://localhost:8000/users/ws/chat/${roomName}/?uuid=${userInfo.user.userId}`);
		}
		setMessages(prevMessages => [""]);
		return websockets[roomName];
	  }

	useEffect(() => {
		if (userInfo.user === undefined )
			return ;
		setFormData(prevState => ({...prevState, username: userInfo.user.username}));
		const ws = getWebSocket(roomName);
		ws.onopen = () => {
			ws.send(JSON.stringify({type:"connected",username: userInfo.user.username}));
			console.log('ws chat opened', userInfo.user)
		};
		ws.onclose = () => console.log('ws chat closed');
		ws.onerror = e => console.log('ws chat error', e);
		ws.onmessage = e => {
			const message = JSON.parse(e.data);
			if (message.type === 'connected') {
				return;
			}
			if (message.type === 'disconnected') {
				return;
			}
			if (message.type === 'chat') {
				setMessages(prevMessages => [...prevMessages, message]);
			}
			console.info('received', message);
		};

		setWs(ws);
		setFormData({ message: '' });

		return () => {
			console.error('ws chat closed');
			ws.onopen = null;
			ws.onclose = null;
			ws.onerror = null;
			ws.onmessage = null;
		};
	}, [roomName,userInfo]);

	const handleChat = async (event) => {
		event.preventDefault();
		// setuserInfo(useContext(userContext));
		console.log('username =', userInfo.user);
		if (userInfo.user.isLogged ===  false) {
			setdisplayer("Need to be logged in");
			console.log("Need to be logged in   ", displayer);
			return;
		}
		setdisplayer("");
		try {
			const currentTime = new Date();
			const formattedTime = currentTime.getHours() + ':' + currentTime.getMinutes();

			console.log("test user",userInfo.user);
			const sent = JSON.stringify({ type:"chat",message: formData.message, date: formattedTime, username: userInfo.user.username });
			ws.send(sent);
			console.info('sent', sent);
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}



	const action = async (username,action) => {
		try {
			const response = await axiosInstance.post('/userlist/', {
				username: username,
				action: action,
				self: userInfo.user.username,
			});
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const handleInputChange = (event) => {
		setFormData({ message: event.target.value });
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			//check if the message is empty
			if (formData.message === '') {
				return;
			}
			handleChat(event);
			handleInputChange(event);
			setFormData({ message: '' });
			event.preventDefault(); // Prevents the default action of the 'Enter' key
		}
	}


	if (userInfo.user === undefined)
		return (<div></div>);
	return (
		<div id="chatWindow" className="chat-window">
			<div id="chatHeader" className="chat-header">
				<div id="chatTitle" className="chat-title">Chat</div>
			</div>
			<div id="chatBody" className="chat-body">
				<div className="displayer-errors">
					{displayer}
				</div>
				<div id="chatContent" className="chat-content">
					{messages.map((message, index) => (
						<div key={index} className="chat-message" ref={index === messages.length - 1 ? messagesEndRef : null}>
							<Nav className="ms-auto">
								<NavDropdown className='dropCustom' id="nav-dropdown-dark" title={message.username}>
									<NavDropdown.Item href={`/${message.username}`}>profile</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item onClick={() => action(message.username,"addfriend")}>AddFriend</NavDropdown.Item>
									<NavDropdown.Item onClick={() => action(message.username,"unfriend")}>Unfriend</NavDropdown.Item>
									<NavDropdown.Item onClick={() => action(message.username,"block")}>Block</NavDropdown.Item>
									<NavDropdown.Item onClick={() => action(message.username,"unblock")}>Unblock</NavDropdown.Item>
								</NavDropdown>
							</Nav>
							<div className="message">
								{message.message} <span className="message-time">{message.date}</span>
							</div>
						</div>
					)).filter((_, index) => index > 0)}
				</div>
				<div id="chatInput" className="chat-input">
					<input
						type="text"
						id="chatInputField"
						className="chat-input-field"
						value={formData.message}
						onChange={handleInputChange}
						onKeyDown={handleKeyPress}
					/>
					{/* <button id="chatSend" className="chat-send" onClick={handleChat}>Send</button> */}
				</div>
				<div className="room_chat">
					<input type="text"
						id="roomName"
						className="room-name"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
					/>
				</div>
				<div className="button">
				</div>
			</div>
		</div>
	  );
}
export default Chat;