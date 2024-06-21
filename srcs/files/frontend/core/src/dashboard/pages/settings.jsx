import "./settings.scss";
import * as React from "react";
import TwoFactorEnable from "../components/twoFactorEnable.jsx";
import { userContext } from "../../contexts/userContext.jsx";
import  { updateInstance } from "../../axiosAPI.js";
import { useTranslation } from 'react-i18next';


 


const Settings = () => {
	const { t } = useTranslation();
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

	// console.log('Settings component data: username mail pass', formData.username, formData.email, formData.password);

	const updateUser = async (updatedData) => {
		// console.log('updateUser: Updating user data 45454');
		//const userinfo = React.useContext(userContext);
		
		try {
		//   console.log('updateUser: Updating user data:', updatedData);
		  // send the updated data to the server
		  const response = await updateInstance.patch(`/users/${userinfo.user.id}/`, updatedData);
	
		  
		  // Update the user context with the new user data
		  userinfo.setUser(response.data);
	  
		//   console.log('updateUser: User data updated successfully', response.data);
		  return response.data;
		} catch (error) {
			// console.log('updateUser: Error updating user data');	
		  if (error.response) {
			setErrors('updateUser: Error response', error.response.status, error.response.data);
		  } else if (error.request) {
			// console.error('updateUser: Error request', error.request);
		  } else {
			// console.error('updateUser: Error', error.message);
		  }
		  throw error;
		}
		// console.log('ENDOF updateUser');
	  };
	

	React.useEffect(() => {
		// console.log('Settings component USE EFFECT \\\\\\\/////\\\/////\/\/\/\/\/', userinfo.user);
		// console.log('DISPLAY ERROS', errors);
		if (userinfo.user) {
		  setFormData({
			username: userinfo.user.username,
			email: userinfo.user.email,
			password: '', // Don't prefill password
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
		// console.log('validate password', password);
	return password.trim() !== '' && password.length >= 6;
	};

	const validateAlias = (alias) => {
	return alias.trim() !== '' && /^[a-zA-Z0-9_]+$/.test(alias);
	};

/*	const handleChange = (e) => {
		
		const { name, value } = e.target;
		// console.log('handleChange event target', name, value);
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
			// console.log('handleChange password valid', valid);
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

	};*/
	

/*	const handleSave = async () => {
		// console.log('///////////////handleSave  "\\\\\\\\\\\"')
		const { username, email, password, alias } = formData;
		if (validateUsername(username) && validateEmail(email) && validatePassword(password) && validateAlias(alias)) 
		{
			// console.log('handleSave: all formData is valid');
		  setLoading(true);
		  setErrors({});
		  try {
			
			const updatedData = { username, email, alias };
			if (password) {
				updatedData.password = password; // Include password only if it's being updated
				// console.log('handleSave: updatedData password included');
			}
				const updatedUser = await updateUser(updatedData);
			// console.log('handleSave: updatedUser successfully', updatedUser);
			userinfo.setUser(updatedUser);

			setIsEditing(false);
			// console.log('handleSave: isEditing set to false 0000000000000');
		  } catch (error) {
			// console.error('handleSave: Error updating user data', error);
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
	};*/

	return (
		<div className="settings">
				<div className="settingsContainer">
					<div className="settingsHeader">
						<span className="settingsTitle">t('options')</span>
					</div>
					<TwoFactorEnable/>
				</div>
		</div>
	);
}

export default Settings;