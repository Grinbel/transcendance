import React from 'react';
import './friends.scss';

import {friendRows} from '../../data.jsx';

import DataTable from '../components/dataTable';

const Friends = () => {

	const friendColumns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: 'avatar',
			headerName: 'Avatar', 
			width: 100,
			renderCell: (params) => {
				return <img src={params.value || "/noavatar.jpg"} alt="avatar"/>
			}
		},                                                                                   
		{
		  field: 'firstName',
		  headerName: 'First name',
		  width: 150,
		  editable: true,
		},
		{
		  field: 'alias',
		  headerName: 'Alias',
		  width: 150,
		  editable: true,
		},
		// {
		//   field: 'fullName',
		//   headerName: 'Full name',
		//   description: 'This column has a value getter and is not sortable.',
		//   sortable: false,
		//   width: 150,
		//   valueGetter: (value, row) => `${row.firstName || ''} ${row.alias || ''}`,
		// },
	  ];

	  const data = {
		columns: friendColumns,
		rows: friendRows,
		linkPath: "user",
	  };

	return (
		<div className="friends">
			<div className="info">
				<h1>Friends</h1>
			</div>
			<div className="userTable"> 
				<DataTable data={data}/>
			</div>
		</div>
	);
}
export default Friends;