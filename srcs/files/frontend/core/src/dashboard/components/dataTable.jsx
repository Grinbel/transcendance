import "./dataTable.scss"
import * as React from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';



import { TbLockOpenOff } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";


const DataTable = ({data}) => {

	const handleDelete = (id) => {
		// send delete request to API

		console.log('delete', id);
	}

	
	const actionColumn = {
		field:'action',
		headerName:'Action',
		flex: 0.2,
		renderCell: (params) => {
			console.log('path', `/${data.linkPath}/${params.row.id}`);
			return (
				<div className="actions">
					<Link to={`/${data.linkPath}/${params.row.id}`} id="actionButton">
						< FaRegEye className="actionImage" id="eyeIcon" />
					</Link>
					<button onClick={() => handleDelete(params.rows.id)} id="actionButton">
						<TbLockOpenOff className="actionImage" id="deleteIcon" />
					</button>
					<link rel="stylesheet" href="" />
				</div>
			)
		}
	}

	return (
		<div className="dataTable">
			<DataGrid
				sx={{
		  			[`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
						outline: 'none',
					},
		  			[`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
		  			  {
			 			outline: 'none',
					},
		}}
				className="dataGrid"
				rows={data.rows}
				columns={[...data.columns, actionColumn]}
				initialState={{
				pagination: {
					paginationModel: {
					pageSize: 10,
					},
				},
				}}
				slots={{ toolbar: GridToolbar }}
				slotProps={{ 
					toolbar:	{	
									csvOptions: { disableToolbarButton: true },
									printOptions: { disableToolbarButton: true },
									showQuickFilter: true,
									quickFilterProps: { debounceMs: 250 },
								},
		
							}}
				pageSizeOptions={[5]}
				checkboxSelection
				disableRowSelectionOnClick
				disableColumnFilter
				disableColumnSelector
				disableColumnResize={true}
				disableDensitySelector
				disableExport

				autoHeight
				// getRowSpacing={ (params) => {
				// 	if (params.row.id % 2 === 0) {
				// 		return '5px';
				// 	}
				// 	return '0px';
				// }}
				
			/>
		</div>
	);
}

export default DataTable;