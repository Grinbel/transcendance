import React from 'react';
import './friends.scss';

import {friendRows} from '../../data.jsx';

import DataTable from '../components/dataTable';

const Friends = () => {

	const friendColumns = [
		{ field: 'id', headerName: 'ID', flex: 0.1 },
		{
			field: 'avatar',
			headerName: 'Avatar', 
			flex: 0.1,
			renderCell: (params) => {
				return <img src={params.value || "/noavatar.jpg"} alt="avatar"/>
			}
		},                                                                                   
		{
		  field: 'firstName',
		  headerName: 'First name',
		  flex: 0.2,
		  editable: true,
		},
		{
		  field: 'alias',
		  headerName: 'Alias',
		  flex: 0.2,
		  editable: true,
		},
		// {
		//   field: 'fullName',
		//   headerName: 'Full name',
		//   description: 'This column has a value getter and is not sortable.',
		//   sortable: false,
		//   flex: 150,
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