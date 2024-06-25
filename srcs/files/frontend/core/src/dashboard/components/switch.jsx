import React from 'react';
import './switch.scss';
import { useTranslation } from 'react-i18next';

const Switch = ({name, status, handleSwitch, onColor}) => {
	const { t } = useTranslation();
	//console.log('Switch component');
  return (
	<div className="switchContainer">
		<span className="switchName">{t('2FA')}</span>
		<input
			checked={status}
			onChange={handleSwitch}
			className="switchCheckbox"
			id={`switch`}
			type="checkbox"
	  	/>
		<label
			style={{ background: status && (onColor ? onColor : '#06D6A0')}}
			className="switchLabel"
			htmlFor={`switch`}
	  	>
			<span className={`switchButton`}></span>
	  	</label>
	</div>
  );
};

export default Switch;