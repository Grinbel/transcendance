import React from "react";
import "./App.css";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Account() {
    const { username } = useParams();
	const { t } = useTranslation();
    // Now you can use the username in your component
	return (
		<div>
			<h1>{username}</h1>
			

			<h1> {t('hi')}</h1>
		</div>
	);
}



export default Account;
