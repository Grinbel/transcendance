import React from 'react';

class Chat extends React.Component {
	lastMessageRef = React.createRef();
	state = {
		isChatOpen: true,
		messages: [],
		currentInput: ''
	}
	componentDidUpdate() {
		if (this.lastMessageRef.current) {
			this.lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
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
}

export default Chat;