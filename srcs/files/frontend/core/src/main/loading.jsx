import React from "react";

const Loading = () => {
	const { t } = useTranslation();
	return (
		<div>
		  <header className="Loading">

			<h1>{t('loading')}</h1>
		  </header>
		</div>
	  );
}

export default Loading;