import React from "react";
import "./App.css";
import { useTranslation } from 'react-i18next';

const User = () => {
	const { t } = useTranslation();
	return (
		<div>
		  <header className="User">
			<h3>{t('User')}</h3>
		  </header>
		</div>
	  );
}

export default User;