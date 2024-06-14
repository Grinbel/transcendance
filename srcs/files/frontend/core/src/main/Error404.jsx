import React from "react";
import { useTranslation } from 'react-i18next';

const Error404 = () => {
	const { t } = useTranslation();
	  return (
	<div>
	  <header className="Error404">

		<h1>{t('error')} 404</h1>
	  </header>
	</div>
  );
}

export default Error404;