import "./settings.scss";
import * as React from "react";

const Settings = () => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [username, setUsername] = React.useState("Unset");
	const [email, setEmail] = React.useState("Unset");
	const [password, setPassword] = React.useState("Unset");
	const [alias, setAlias] = React.useState("Unset");

	return (
		<div className="settings">
			<div className="settingsContainer">
				<div className="settingsHeader">
					<span className="settingsTitle">Settings</span>
				</div>
				<div className="settingsBody">
					<div className="settingsItem">
						<span className="settingsItemTitle">Username: </span>
						
						{isEditing ? (
							<input
								type="text"
								className="settingsItemInput"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						) : (
							<span className="settingsItemContent">{username}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Email: </span>
						{isEditing ? (
							<input
								type="text"
								className="settingsItemInput"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						) : (
							<span className="settingsItemContent">{email}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Password: </span>

						{isEditing ? (
							<input
								type="password"
								className="settingsItemInput"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						) : (
							<span className="settingsItemContent">{password}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Alias: </span>
						
						{isEditing ? (
							<input
								type="text"
								className="settingsItemInput"
								value={alias}
								onChange={(e) => setAlias(e.target.value)}
							/>
						) : (
							<span className="settingsItemContent">{alias}</span>
						)}
					</div>
				</div>
				<div className="settingsFooter">
					<button
						className="settingsButton"
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? "Save" : "Edit"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Settings;