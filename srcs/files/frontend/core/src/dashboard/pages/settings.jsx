import "./settings.scss";
import * as React from "react";
import TwoFactorEnable from "../components/twoFactorEnable.jsx";
import { userContext } from "../../contexts/userContext.jsx";
import  { axiosInstance, loginInstance } from "../../axiosAPI.js";



 
const updateUser = async (updatedData) => {
	console.log('updateUser: Updating user data 45454');
	const userinfo = React.useContext(userContext);
	
	try {
	  console.log('updateUser: Updating user data:', updatedData);
	  // send the updated data to the server
	  // const response = await axiosInstance.post(`/users/${userinfo.user.id}/`, updatedData);

	//   const response = await axiosInstance.post(`/users/${userinfo.user.id}/`, updatedData);
  	
	  // Update the user context with the new user data
	  userinfo.setUser(response.data);
  
	  console.log('updateUser: User data updated successfully', response.data);
	  return response.data;
	} catch (error) {
		console.log('updateUser: Error updating user data');	
	  if (error.response) {
		console.error('updateUser: Error response', error.response.status, error.response.data);
	  } else if (error.request) {
		console.error('updateUser: Error request', error.request);
	  } else {
		console.error('updateUser: Error', error.message);
	  }
	  throw error;
	}
  };


const Settings = () => {
	const [isEditing, setIsEditing] = React.useState(false);

	const [errors, setErrors] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const userinfo = React.useContext(userContext);

	const [formData, setFormData] = React.useState({
		username: userinfo.user?.username || 'Unset',
		email: userinfo.user?.email || 'Unset',
		password: '******',
		alias: userinfo.user?.alias || 'Unset',
	  });

	console.log('Settings component');
	console.log('isEditing', isEditing);
	console.log('username', formData.username);
	console.log('email', formData.email);
	console.log('password', formData.password);
	console.log('alias', formData.alias);

	React.useEffect(() => {
		if (userinfo.user) {
		  setFormData({
			username: userinfo.user.username,
			email: userinfo.user.email,
			password: '******', // Don't prefill password
			alias: userinfo.user.alias || 'Unset',
		  });
		}
	  }, [userinfo.user]);


	const validateUsername = (username) => {
	return username.trim() !== '' && /^[a-zA-Z0-9_]+$/.test(username);
	};

	const validateEmail = (email) => {
	return email.trim() !== '' && /\S+@\S+\.\S+/.test(email);
	};

	const validatePassword = (password) => {
	return password.trim() !== '' && password.length >= 6;
	};

	const validateAlias = (alias) => {
	return alias.trim() !== '' && /^[a-zA-Z0-9_]+$/.test(alias);
	};

	const handleChange = (e) => {
		
		const { name, value } = e.target;
		console.log('handleChange event target', name, value);
		setFormData({ ...formData, [name]: value });

 		// Inline validation
		let valid;
		switch (name) {
		case 'username':
			valid = validateUsername(value);
			setErrors((prevErrors) => ({
			...prevErrors,
			username: valid ? '' : 'Invalid username. Only letters, numbers, and underscores are allowed.',
			}));
			break;
		case 'email':
			valid = validateEmail(value);
			setErrors((prevErrors) => ({
			...prevErrors,
			email: valid ? '' : 'Invalid email address.',
			}));
			break;
		case 'password':
			valid = validatePassword(value);
			setErrors((prevErrors) => ({
			...prevErrors,
			password: valid ? '' : 'Password must be at least 6 characters long.',
			}));
			break;
		case 'alias':
			valid = validateAlias(value);
			setErrors((prevErrors) => ({
			...prevErrors,
			alias: valid ? '' : 'Invalid alias. Only letters, numbers, and underscores are allowed.',
			}));
			break;
		default:
			break;
		};

	};
	

	const handleSave = async () => {
		console.log('handleSave')
		const { username, email, password, alias } = formData;
		if (validateUsername(username) && validateEmail(email) && validatePassword(password) && validateAlias(alias)) 
		{
			console.log('handleSave: all formData is valid');
		  setLoading(true);
		  setErrors({});
		  try {
			
			const updatedData = { username, email, alias };
			if (password) updatedData.password = password; // Include password only if it's being updated
			const updatedUser = await updateUser(updatedData);
			console.log('handleSave: updatedUser successfully', updatedUser);
			setUser(updatedUser);

			setIsEditing(false);
		  } catch (error) {
			setErrors({ form: error.message });
		  } finally {
			setLoading(false);
		  }

		} else {
		  setErrors({
			username: validateUsername(username) ? '' : 'Invalid username.',
			email: validateEmail(email) ? '' : 'Invalid email.',
			password: password === '' || validatePassword(password) ? '' : 'Invalid password.',
			alias: validateAlias(alias) ? '' : 'Invalid alias.',
		  });
		}
	};

	return (
		<div className="settings">
			<div className="settingsContainer">
				<div className="settingsHeader">
					<span className="settingsTitle">Edit personal data</span>
				</div>
				<div className="settingsBody">
					<div className="settingsItem">
						<span className="settingsItemTitle">Username: </span>
						
						{isEditing ? (
							<input
								name="username"
								type="text"
								className="settingsItemInput"
								value={formData.username}
								onChange={handleChange}
							/>
						) : (
							<span className="settingsItemContent">{formData.username}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Email: </span>
						{isEditing ? (
							<input
								name="email"
								type="text"
								className="settingsItemInput"
								value={formData.email}
								onChange={handleChange}
							/>
						) : (
							<span className="settingsItemContent">{formData.email}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Password: </span>

						{isEditing ? (
							<input
								name= "password"
								type="password"
								className="settingsItemInput"
								value={formData.password}
								onChange={handleChange}
							/>
						) : (
							<span className="settingsItemContent">{formData.password}</span>
						)}
					</div>
					<div className="settingsItem">
						<span className="settingsItemTitle">Alias: </span>
						
						{isEditing ? (
							<input
								name="alias"
								type="text"
								className="settingsItemInput"
								value={formData.alias}
								onChange={handleChange}
							/>
						) : (
							<span className="settingsItemContent">{formData.alias}</span>
						)}
					</div>
				</div>

				<div className="settingsFooter">
					{isEditing ? (
						<button className="settingsButton" onClick={handleSave} disabled={loading}>
						{loading ? 'Saving...' : 'Save'}
						</button>
					) : (
						<button className="settingsButton" onClick={() => setIsEditing(true)}>
						Edit
						</button>
					)}
				</div>



			</div>
				<div className="settingsContainer">
					<div className="settingsHeader">
						<span className="settingsTitle">Options</span>
					</div>
					<TwoFactorEnable/>
				</div>
		</div>
	);
}

export default Settings;