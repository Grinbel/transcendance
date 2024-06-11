import React from 'react';
import './switch.scss';

const Switch = ({name, status, handleSwitch, onColor}) => {
	console.log('Switch component');
  return (
	<div className="switchContainer">
		<span className="switchName">2FA Authentication: </span>
		<input
			checked={status}
			onChange={handleSwitch()}
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