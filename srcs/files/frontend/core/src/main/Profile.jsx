import React from "react";
import { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../contexts/userContext.jsx";
import  { axiosInstance } from "../axiosAPI.js";
import "./Home.css";
import { Button } from "react-bootstrap";
const Profile = () => {
	let { username } = useParams();
	const userInfo = useContext(userContext);
	const [friend, setFriend] = useState();
	const [friends, setFriends] = useState([]);
	const messagesEndRef = useRef(null);

	const [block, setBlock] = useState();
	const [error, setError] = useState();
	const location = useLocation();
	
	const message = location.state;
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);

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
			setFriend(response.data.friend)
			setBlock(response.data.block);
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	useEffect(() => {
		if (userInfo.user === undefined)
			return ;
		if (username === undefined){
			navigate(`/profile/${userInfo.user.username}`)
			return ;
		}
		if(userExist(username) == false)
			return;
		info(username);
		userFriend(username);
	},[username,userInfo,friend,block]);


	const userExist = async (username) => {
		try {
			const response = await axiosInstance.post('/userexist/', {
				username: username,
			});
			if (response.data.detail === "User does not exist")
			{
				navigate(`/profile/${userInfo.user.username}`)
				return false;
			}
			return true;
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}

	const userFriend = async (username) => {
		try {
			const response = await axiosInstance.post('/userfriendlist/', {
				username: username,
			});
			setFriends(response.data);
		} catch (error) {
			setError(error.message);
			throw (error);
		}
	}
	return (
		<div>
			<h1>{username}</h1>
			<header className="add">
				{friend != undefined && friend === false && <Button onClick={() => { action(username,"addfriend"); setFriend(true); }}>AddFriend</Button>}
				{friend != undefined && friend === true && <Button onClick={() => { action(username,"unfriend"); setFriend(false);}}>Unfriend</Button>}
				{block != undefined && block === false && <Button onClick={() => { action(username,"block"); setBlock(true);}}>Block</Button>}
				{block != undefined && block === true && <Button onClick={() => { action(username,"unblock"); setBlock(false);}}>Unblock</Button>}
			</header>
			<div className="friend">
				<h6>Friend List</h6>
				{Array.isArray(friends.friends) && friends.friends.map((friend, index) => (
					<div key={index} className="chat-message">
						<div className="chat-username">
							<a href="#" onClick={(e) => {e.preventDefault(); navigate(`/profile/${friend}`);}}>
								{friend}
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	  );
}

export default Profile;