import React from 'react';
// import  { axiosInstance } from "./axiosAPI.js";
import  { useEffect, useState, useRef } from 'react';
import { Link,useLocation } from 'react-router-dom';
import "./Chat.css";
import "./dropdown.css";
// import "./Home.css";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { axiosInstance} from "../axiosAPI.js";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import xss from 'xss';
import { useTranslation } from 'react-i18next';


function Chat() {
	const [messages, setMessages] = useState([]);
	const { t } = useTranslation();
	const userInfo = useContext(userContext);
	// console.log('CHAT //// userInfo', userInfo.user);
	const [reminder,setReminder] = useState(false);
	const [formData, setFormData] = useState({ message: '', date: '', username: '', type: "chat"});
	const [privateMessage,setPrivate]= useState({message:'', receiver:''});
	const [error, setError] = useState(null);
	const [ws, setWs] = useState(null);
	const messagesEndRef = React.createRef()
	const [displayer, setdisplayer] = useState("");
	const [roomName,setRoomName] = useState("general");
	const [friend,setFriend] = useState("");
	const [block,setBlock] = useState("");
	const [hideChat, setHideChat] = useState(false);
	const navigate = useNavigate();
	const websockets = {};
	let location = useLocation();


	useEffect(() => {
		  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	  }, [messages]);

	function getWebSocket(roomName) {
		
		if (!websockets[roomName] && userInfo.user !== undefined && userInfo.user.id !== undefined) {
		  websockets[roomName] = new WebSocket(`wss://${import.meta.env.VITE_API_SERVER_ADDRESS}:8443/users/ws/chat/${roomName}/?uuid=${userInfo.user.id}`);
		}
		return websockets[roomName];
	  }

	useEffect(() => {
		// let serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
		// if (process.env.REACT_APP_SERVER_ADDRESS == 'c1r2p4')
		// 	console.log("pop");
		// const serverAddres = process.env.VITE_API_SERVER_ADDRESS;

		// console.log('serverAddress', serverAddress);
		setdisplayer("");

		if (userInfo.user === undefined || userInfo.user.id === undefined)
			return ;
		else if (userInfo.user.tournamentIsLaunching===true){
			setdisplayer(t('game_begins'));
			// userInfo.setUser({...userInfo.user,tournamentIsLaunching:false});
		}
		setFormData(prevState => ({...prevState, username: userInfo.user.username}));
		const ws = getWebSocket(roomName);
		// pop = new WebSocket(`wss://c1r2p5.42nice.fr:8443/users/ws/chat/general/?uuid=40`);
// pop.onopen = () => {}
// pop.send({"type":"chat","message":"hola"});
		ws.onopen = () => {
			if (userInfo.user === undefined || messages.length > 0)
				return ;
			ws.send(JSON.stringify({type:"connected"}));
		};
		ws.onclose = () => {
			// console.log('ws chat closed')
		};
		ws.onerror = e =>{
			//  console.log('ws chat error', e);
		}
		ws.onmessage = e => {
			const message = JSON.parse(e.data);
			let newmessage;
			if (message.type === 'send_invite'){
				newmessage = {...message, message: `${message.username} ${t('invite')}`};
				setMessages(prevMessages => [...prevMessages, newmessage]);
			}
			else if (message.type === 'next_game_player'){
				newmessage = {...message, message: `${message.p1} ${t('next_game1')} ${message.p2} ${t('next_game2')}`};
				setMessages(prevMessages => [...prevMessages, newmessage]);
			}
			else if(message.type === 'logout'){
				navigate('/login');
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('user');
				axiosInstance.defaults.headers['Authorization'] = null;
				axiosInstance.defaults.headers['Authorization'] = null;

				userInfo.setUser();
				// console.log('NavLoggedIn: logout successful frontend');
			}
			else
				setMessages(prevMessages => [...prevMessages, message]);
			// console.log('ws chat message', message, message.username);
		};

		setWs(ws);
		setFormData({ message: '' });

		return () => {
			// console.error('ws chat closed');
			ws.onopen = null;
			ws.onclose = null;
			ws.onerror = null;
			ws.onmessage = null;
		};
	}, [roomName,userInfo]);

	const handleChat = async (event) => {
		event.preventDefault();
		// setuserInfo(useContext(userContext));
		// console.log('username =', userInfo.user);
		if (userInfo.user.isLogged ===  false) {
			setdisplayer(t('need login'));
			// console.log("Need to be logged in   ", displayer);
			return;
		}


		setdisplayer("");
		try {
			const currentTime = new Date();
			const formattedTime = currentTime.getHours() + ':' + currentTime.getMinutes();

			if (formData.message === '') {
				return;
			}
			const clean =xss(formData.message);

			const sent = JSON.stringify({ type:'chat',message: clean});
			ws.send(sent);
			// setFormData({ message: '',type: 'chat'});
			// console.info('sent', sent);
		} catch (error) {
			setError(error.message);
			//throw (error);
		}
	}

	const handlePrivate = async (event) =>{
		event.preventDefault();

		if (userInfo.user.isLogged ===  false) {
			setdisplayer(t('need_login'));
			// console.log("Need to be logged in   ", displayer);
			return;
		}
		setdisplayer("");
		try {
			if (privateMessage.message === '')
				return;
			const clean =xss(privateMessage.message);

			const sent = JSON.stringify({type:'private', message: clean ,username: userInfo.user.username, receiver:privateMessage.receiver})

			ws.send(sent);
		} catch (error) {
			setError(error.message);
			//throw (error);
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
			//throw (error);
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
		} catch (error) {
			setError(error.message);
			//throw (error);
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
			if (privateMessage.message === '' ) {
				return;
			}
			handlePrivate(event);
			setPrivate({message:'',receiver:''});
			event.preventDefault();
		}
	}

	const privateChat = (username) => {
		return (
		<div className="chat-input">
			<input
				type="text"
				id="privateInputField"
				className="private-input-field"
				placeholder={`${t('send_to')} ${username}`}
				value={privateMessage.message}
				onChange={(e) =>setPrivate({message:e.target.value, receiver:username})}
				onKeyDown={handleKeyPressprivate}
				maxLength={90}

			/> 
		</div>
		);
	};

	const goToTournament = async (room) =>{
		try {
			setdisplayer('');
			const response = await axiosInstance.post('/choice/', {
				tournamentId: room,
				playerCount: "2",
				username: userInfo.user.username,
				alias: userInfo.user.username,
				join:true ,
				isEasy: false,
				speed:20,
				score:10,
				skin:2,
			});
			// console.log('response', response.data);
			// console.log('Room name', response.data.room_name);
			// console.log('error', response.data.Error);

			//check if response.data contains the word error

			if (response.data.Error != undefined){
				setdisplayer(t(response.data.Error));
				// console.log('Invalid tournament');
			}
			else {
				// console.log('Tournament name: ' + response.data.room_name);
				//! tournament is not inside the cached data
				userInfo.setUser({
					...userInfo.user,
					tournament: response.data.room_name
				  });
				navigate('/tournament/');
			}
		} catch (error) {
			// if (error.response) {
	
			// } else if (error.request) {
				// console.log('error REQUEST', error.request);
			// } else {
				// console.log('error OBSCURE', error.request);
			// }
			setError(error.message);
			//throw (error);
		}
	}
	const sendInvite = async(username)=>
		{
			// console.log("INVITE ",username)
			try {
				const response = await axiosInstance.post('/inviteTournament/', {
					receiver: username,
					room: userInfo.user.tournament,
					self: userInfo.user.username,
				});
			} catch (error) {
				setError(error.message);
				//throw (error);
			}
		}
	if (userInfo.user === undefined || location.pathname === '/game' || location.pathname === '/multigame'){
		return (<div></div>);
	}

	return (
		<div>
			<button className="hide-chat" onClick={() => setHideChat(!hideChat)}>{hideChat ? t('Show Chat') : t('Hide Chat')}</button>
			<div id="chatWindow" className={`chat-window ${hideChat ? 'hidden' : ''}`}>
				<div id="chatHeader" className="chat-header">
					<div id="chatTitle" className="chat-title">{t(hideChat ? '' : 'Chat')}</div>
				</div>
				{!hideChat && (
				<div id="chatBody" className="chat-body">
					
					<div id="chatContent" className="chat-content">
						{messages.filter((message, index) => index > 0 ).map((message, index) => (
							<div key={index} className="chat-message" ref={messagesEndRef}>
								{ message.username !== undefined &&<Nav className="ms-auto">
									<NavDropdown className='chatdrop' id="chat-dropdown" title={message.username} onClick={() => info(message.username)}>
										<NavDropdown.Item onClick={() => navigate(`/profile/${message.username}`)}>{t('profile')}</NavDropdown.Item>
										{friend != undefined &&  <NavDropdown.Divider />}
										{/* <NavDropdown.Item onClick={() => setFormData({message: `/whisper ${message.username}`,type : 'private'})}>Whisper</NavDropdown.Item> */}
										{friend != undefined && friend === false && <NavDropdown.Item onClick={() => action(message.username,"addfriend")}>{t('addfriend')}</NavDropdown.Item>}
										{friend != undefined && friend === true && <NavDropdown.Item onClick={() => action(message.username,"unfriend")}>{t('unfriend')}</NavDropdown.Item>}
										{block != undefined && block === false && <NavDropdown.Item onClick={() => action(message.username,"block")}>{t('block')}</NavDropdown.Item>}
										{block != undefined && block === true && <NavDropdown.Item onClick={() => action(message.username,"unblock")}>{t('unblock')}</NavDropdown.Item>}
										{window.location.pathname === "/tournament/"&&message.username != userInfo.user.username && <NavDropdown.Item onClick={() => sendInvite(message.username)}>{t('invite_2')}</NavDropdown.Item>}
										{privateChat(message.username)}
									</NavDropdown>
								</Nav>}
								
								{message.type === 'chat' && <div className="message">
									{message.message} <span className="message-time">{message.date}</span>
								</div>}
								{message.type === 'private_message' && <div className="private">
									{message.message} <span className="message-time">{message.date}</span>
								</div>}
								{message.type === 'send_invite' && <div className="invite">
									{message.message}
									<button className="link" onClick={() => goToTournament(message.room)}>
										{t('join')}
									</button>
								</div>}
								{message.type === 'next_game_player' && <div className="private">
									{message.message}
								</div>}
								
							</div>
						))}
					</div>
					<div className="displayer-errors">
						{displayer}
					</div>
					
					<div className="chat-chat">
						<input
							type="text"
							id="chatInputField"
							className="chat-input-field"
							placeholder={`${t('send')}`}
							value={formData.message}
							onChange={(e) =>setFormData({ message: e.target.value })}
							onKeyDown={handleKeyPress}
							maxLength={90}
						/>
					</div>
					{/* <div className="room_chat">
						<input type="text"
							id="roomName"
							className="room-name"
							value={roomName}
							onChange={(e) => setRoomName(e.target.value)}
						/>
					</div> */}
				</div>)}
			</div>
		</div>
	  );
}
export default Chat;