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
import { useNavigate } from 'react-router-dom';


// function websockets() {
// 	const response = await axiosInstance.post('/login/', {
// 		username: formData.username,
// 		password: formData.password
// 		});
// }

function Chat() {
	const userInfo = useContext(userContext);
	
	const [formData, setFormData] = useState({ message: '', date: '', username: '', type: "chat"});
	const [privateMessage,setPrivate]= useState({message:'', receiver:''});
	const [error, setError] = useState(null);
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState(null);
	const messagesEndRef = useRef(null);
	const [displayer, setdisplayer] = useState("");
	const [roomName,setRoomName] = useState("general");
	const [friend,setFriend] = useState("");
	const [block,setBlock] = useState("");
	const navigateTo = useNavigate();
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
			if (message.type === 'chat') {
				message.type = 'chat';
				setMessages(prevMessages => [...prevMessages, message]);
			}
			else if (message.type === 'private_message') {
				// return;
				message.type = 'private';
				setMessages(prevMessages => [...prevMessages, message]);
			}
			else if (message.type === 'send_invite') {
				message.type = 'invite';
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

			if (formData.message === '') {
				return;
			}
			const sent = JSON.stringify({ type:'chat',message: formData.message, date: formattedTime, username: userInfo.user.username});
			ws.send(sent);
			// setFormData({ message: '',type: 'chat'});
			console.info('sent', sent);
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const handlePrivate = async (event) =>{
		event.preventDefault();
		if (userInfo.user.isLogged ===  false) {
			setdisplayer("Need to be logged in");
			console.log("Need to be logged in   ", displayer);
			return;
		}
		setdisplayer("");
		try {
			if (privateMessage.message === '')
				return;
			const sent = JSON.stringify({type:'private', message: privateMessage.message,username: userInfo.user.username, receiver:privateMessage.receiver})
			ws.send(sent);
		} catch (error) {
			setError(error.message);
			throw (error);
		}

	}


	const action = async (username,action) => {
		
		try {
			const response = await axiosInstance.post('/userlist/', {
				other: username,
				action: action,
				self: userInfo.user.username,
			});
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const info = async (username) => {
		// return ;
		try {
			const response = await axiosInstance.post('/userfriendblock/', {
				friend: username,
				self: userInfo.user.username,
			});
			if (response.data.detail === "User not found")
			{
				setFriend("");
				setBlock("");
			}
			setFriend(response.data.friend);
			setBlock(response.data.block);
			console.log("friend = ",friend);
			console.log("block = ",block);
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}


	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			if (formData.message === '') {
				return;
			}
			handleChat(event);
			setFormData({ message: ''});
			event.preventDefault();
		}
	}
	const handleKeyPressprivate = (event) => {
		if (event.key === 'Enter') {
			if (privateMessage.message === '') {
				return;
			}
			handlePrivate(event);
			setPrivate({message:'',receiver:''});
			event.preventDefault();
		}
	}

	const privateChat = (username) => {
		return (
		<div id="privateChat" className="private-input">
			<input
				type="text"
				id="privateInputField"
				className="private-input-field"
				//TODO texte brut
				placeholder={`Envoyer a ${username}`}
				value={privateMessage.message}
				onChange={(e) =>setPrivate({message:e.target.value, receiver:username})}
				onKeyDown={handleKeyPressprivate}
			/> 
		</div>
		);
	};

	const goToTournament = async (room) =>{
		try {
			const response = await axiosInstance.post('/choice/', {
				tournamentId: room,
				playerCount: "",
				isLocal: "",
				username: userInfo.user.username,
				join:true  && room === "",
			});
			console.log('response', response.data);
			console.log('Room name', response.data.room_name);
			console.log('error', response.data.Error);

			//check if response.data contains the word error

			if (response.data.Error != undefined){
				setdisplayer(response.data.Error);
				console.log('Invalid tournament');
			}
			else {
				console.log('Tournament name: ' + response.data.room_name);
				//! tournament is not inside the cached data
				userInfo.setUser({
					...userInfo.user,
					tournament: response.data.room_name
				  });
				navigateTo('/tournament/');
			}
		} catch (error) {
			if (error.response) {
	
			} else if (error.request) {
				console.log('error REQUEST', error.request);
			} else {
				console.log('error OBSCURE', error.request);
			}
			setError(error.message);
			throw (error);
		}
	}
	if (userInfo.user === undefined)
		return (<div></div>);


	return (
		<div id="chatWindow" className="chat-window">
			<div id="chatHeader" className="chat-header">
				{/* //TODO texte brut */}
				<div id="chatTitle" className="chat-title">Chat</div>
			</div>
			<div id="chatBody" className="chat-body">
				
				<div id="chatContent" className="chat-content">
					{messages.map((message, index) => (
						<div key={index} className="chat-message" ref={index === messages.length - 1 ? messagesEndRef : null}>
							<Nav className="ms-auto">
								<NavDropdown className='dropCustom' id="nav-dropdown-dark" title={message.username} onClick={() => info(message.username)}>
									
									{/* //TODO texte brut */}
									<NavDropdown.Item href={`/${message.username}`}>profile</NavDropdown.Item>
									{friend != undefined &&  <NavDropdown.Divider />}
									{/* //TODO texte brut */}
									{/* <NavDropdown.Item onClick={() => setFormData({message: `/whisper ${message.username}`,type : 'private'})}>Whisper</NavDropdown.Item> */}
									{friend != undefined && friend === false && <NavDropdown.Item onClick={() => action(message.username,"addfriend")}>AddFriend</NavDropdown.Item>}
									{friend != undefined && friend === true && <NavDropdown.Item onClick={() => action(message.username,"unfriend")}>Unfriend</NavDropdown.Item>}
									{block != undefined && block === false && <NavDropdown.Item onClick={() => action(message.username,"block")}>Block</NavDropdown.Item>}
									{block != undefined && block === true && <NavDropdown.Item onClick={() => action(message.username,"unblock")}>Unblock</NavDropdown.Item>}
									{privateChat(message.username)}
								</NavDropdown>
							</Nav>
							{/* <div className="message">
								{message.message} <span className="message-time">{message.date}</span>
							</div> */}
							{message.type === 'chat' && <div className="message">
								{message.message} <span className="message-time">{message.date}</span>
							</div>}
							{message.type === 'private' && <div className="private">
								{message.message} <span className="message-time">{message.date}</span>
							</div>}
							{message.type === 'invite' && <div className="invite">
								{message.message}
								<a href="#" onClick={(e) => {e.preventDefault(); goToTournament(message.room);}}>
									Accept
								</a>
							</div>}
						</div>
					)).filter((_, index) => index > 0)}
				</div>
				<div className="displayer-errors">
					{displayer}
				</div>
				<div id="chatInput" className="chat-input">
					<input
						type="text"
						id="chatInputField"
						className="chat-input-field"
						//TODO texte brut
						placeholder={`Envoyer dans ${roomName}`}
						value={formData.message}
						onChange={(e) =>setFormData({ message: e.target.value })}
						onKeyDown={handleKeyPress}
					/>
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